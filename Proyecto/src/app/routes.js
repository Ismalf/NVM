var nodemailer = require('nodemailer');
const express = require('express');

var formidable = require('formidable');

//multer module used for uploadings
var multer = require('multer');
//stablish where are the new files going to be stored
var storage = multer.diskStorage({
    destination: function(req, file,cb){
        //temporary directory for media files
        cb(null,'../src/public/media_files/tmp')
    },
    //maintain the original name
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});
var upload = multer({storage:storage});

//module required to read the file system
var fs=require('fs');

//Modules to make DB data retrieval
var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

let profile = {
  about: "",
  links: {
    iglink: "",
    fblink: "",
    twlink: "",
    olink: ""
  },
  imgdir: "",
  followers: ""
};
let username = null;
module.exports=(app,passport)=>{
    /*Function used to get the index*/
    app.get('/',(req,res)=>{
        res.render('index');
    });

    /*function used to get the login page*/
    app.get('/login', function(req, res){
        res.render('login', {message:req.flash('loginMessage')});
    });

    /*function used to check credentials*/
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/main',
        failureRedirect: '/login',
        failureFlash: true
        }), function(req, res){
        if(req.body.remember){
          req.session.cookie.maxAge = 1000 * 60 * 3;
        }else{
          req.session.cookie.expires = false;
        }
        res.redirect('/login');
    });

    /*function used to get the register page*/
    app.get('/registro', function(req, res){
        res.render('registro', {message: req.flash('signupMessage')});
    });

    /*function used to register a new user*/
    app.post('/registro1', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/registro',
        failureFlash: true
    }));

    app.post('/registro2', passport.authenticate('local-signup1', {
        successRedirect: '/main',
        failureRedirect: '/registro',
        failureFlash: true
    }));

    app.get('/mail',(req,res)=>{
        res.render('mail');
    });

    app.post('/mail',function(req, res, next){
        var transporte = nodemailer.createTransport({
            service: 'Hotmail',
            auth:{
                user: 'chebasportilla2010@hotmail.com',
                pass: 'colegiobrasil97'
            }
        });
        var mailOptions={
            from: "Alexander Portilla <chebasportilla2010@hotmail.com>",
            to: req.body.correo,
            subject:req.body.asunto,
            text: req.body.mensaje,
        };
        transporte.sendMail(mailOptions,function(error,response){
            if(error){
                console.log(req.body.correo);
                console.log(req.body.mensaje);
                res.render('main');
            }else {
                console.log('Mensaje Enviado',+response.message);
                res.render('mail');
            }
        });
    });

    app.post('/upload_media', upload.any(), function (req, res)  {

//------------------------------------------------ Artist's Music -------------------------------------------------
// Music files are saved in directories.
// Each song is saved according to it´s parent directorioes
// Media Files -> 'Artist' -> 'Album' -> 'Song'
// Default album: Single
//-----------------------------------------------------------------------------------------------------------------
        var artist_album_song = '../src/public/media_files/'+req.body.artist+'/'+req.body.album;

        if(!fs.existsSync(artist_album_song)){
            //console.log('creating directory');
            fs.mkdir(artist_album_song, {recursive:true}, function(err){
                if(err){
                    console.log(err);
                }else{
                  req.files.forEach((file)=>{
                      fs.rename('../src/public/media_files/tmp/'+file.originalname, artist_album_song+'/'+file.originalname, function(err){
                          if(err){
                              console.log(err);
                          }else{
                              //console.log('success');
                          }
                      });
                  });
                }
            });
        }


        res.end();

    });

    app.get('/main', async(req, res)=>{
        var title = "Discover";
        console.log(req.user.USERNAME);
        var user = req.user;
        var topalbums = null;
        var artists = null;
        var topsongs = null;
       res.render('main',{topalbums, title, artists, topsongs, user});
    });

    /*Get request to load the top albums in the site*/
    app.get('/main/albums', async (req, res) => {
        console.log('reading File');
        var content = fs.readFileSync('../src/public/media_files/Top/TopAlbums.data','utf8');
        console.log(content);
        var contents = content.split('\r');
        console.log('content');
        var album_artist_model;
        var topalbums=[];
        contents.forEach(file => {
            var tmp = file.split('/');
            if(tmp[5]!='Single'){
                album_artist_model = {
                    album: tmp[5],
                    artist: tmp[4]
                }
                console.log('Line:');
                console.log(album_artist_model);
                topalbums.push(album_artist_model);
            }
        });
        var artists=null;
        var topsongs=null;
        var title='Top Albums';
        res.render('partials/_mainbody',{topalbums, title, artists, topsongs});
    });

    /*Get request to load the top artists in the site*/
    app.get('/main/popartists', async (req, res) => {
        var content = fs.readFileSync('../src/public/media_files/Top/TopArtists.data','utf8');
        console.log(content);
        var contents = content.split('\r');
        console.log('content');
        var artist_model;
        var artists=[];
        contents.forEach(file => {
            var tmp = file.split('/');
            artist_model = {
                artist: tmp[4]
            }
            console.log('Line:');
            console.log(artist_model);
            artists.push(artist_model);
        });
        console.log(artists);
        var topalbums = null;
        var topsongs=null;
        var title='Top Artists';
        res.render('partials/_mainbody.ejs',{topalbums, title, artists, topsongs});
    });

    /*Get request to load the top songs in the site*/
    app.get('/main/topsongs', async (req, res) => {
        var content = fs.readFileSync('../src/public/media_files/Top/TopSongs.data','utf8');
        console.log(content);
        var contents = content.split('\r');
        console.log('content');
        var song_model;
        var topsongs=[];
        contents.forEach(file => {
            var tmp = file.split('/');
            song_model = {
                title: tmp[6].split('.')[0],
                album: tmp[5],
                artist: tmp[4]
            }
            console.log('Line:');
            console.log(song_model);
            topsongs.push(song_model);
        });
        console.log(topsongs);
        var topalbums = null;
        var artists=null;
        var title='Top Songs';
        res.render('partials/_mainbody',{topalbums, title, artists, topsongs});
    });

    /*Get request to load an album as a playlist*/
    app.get('/main/:artist/:album', async (req, res) => {
        var content = fs.readdirSync('../src/public/media_files/'+req.params.artist+'/'+req.params.album);
        var songs = [];
        content.forEach(file=>{
           songs.push('../media_files/'+req.params.artist+'/'+req.params.album+'/'+file);
        });
        console.log(songs);
        res.send(songs);
    });

    app.get('/main/myprofile', async(req, res)=>{
      console.log('Accessing a profile:'+req.user.USERNAME);
      //To get the correct profile, first we need to know what account type it is
      if(req.user.TYPE_ACCOUNT == 'Artist'){
        username = req.user.USERNAME;
        console.log('acceding my profile');
        //If it's an artist account, we proceed to get the albums
        /*
          Author: ismalfmp
          Albums is an array of directories names.
          ------ objective of this function --------
          Read all the names of the artist's albums.
        */


        //Check getprofileinfo function documentation
        console.log('retrieving data');
        getinfo().then(function(){
            var albums = fs.readdirSync('../src/public/media_files/'+req.user.USERNAME);
            var albumsd=[];
            console.log(albums);
            var songs = [];
            var song2 = {};
            var albums2 = {};
            /*
              Author: ismalfmp
              Songs is an array of songs names.
              ---------------- objetive of this function -----------------
              Read all the songs contained on each Album (from var Albums)
            */
            albums.forEach(album=>{
              //read the names on each album and save them on an array.
              if(album!='img.jpeg'){
                albums2.album = album;
                albums2.artist = username;
                albumsd.push(albums2);
                var tmp = fs.readdirSync('../src/public/media_files/'+req.user.USERNAME+'/'+album);
              //save the song's name without the extension.
                tmp.forEach(song => {
                  song2.title = song.split('.')[0];
                  song2.album = album;
                  songs.push(song2);
                });
              }
            });
            console.log(songs);
            var editable = true;
            console.log('loading profile of');
            console.log(username);
            var numofsongs = songs.length;
            var numofalbums = albums.length;
            res.render('partials/_profile',{username, editable, profile, numofsongs, numofalbums, songs, albumsd});
        }).catch(function(p){
          console.log(p);
        });

      }
      if(req.user.TYPE_ACCOUNT == 'Simple'){
        //render simple user profile
      }
      if(req.user.TYPE_ACCOUNT == 'Business'){
        //render record label profile
      }
    });

    app.post('/fillprofile', upload.single('avatar'), function(req,res){
      var dir = '../src/public/media_files/'+req.user.USERNAME;
      console.log(dir);
      if(!fs.existsSync(dir)){
        fs.mkdir(dir, {recursive:true}, function(err){
            if(err){
                console.log(err);
            }else{
              console.log('created: '+'../src/public/media_files/'+req.body.username);
            }
        });
      }
      console.log(req.file.filename);
      fs.rename('../src/public/media_files/tmp/'+req.file.originalname, dir+'/img.jpeg', function(err){
          if(err){
              console.log(err);
          }else{
              //console.log('success');
          }
      });
      var imgdir = '../media_files/'+req.user.USERNAME+'/img.jpeg';
      var query = "INSERT INTO profile (id_account, username, IG_profile_link, FB_profile_link, TW_profile_link, Other_link, desc_profile, dir_profile_img)"+
       "VALUES ((SELECT id_account FROM account WHERE username = '"+req.user.USERNAME+"'), '"+req.user.USERNAME+"','"+req.body.ig+"','"+req.body.fb+"','"
      +req.body.tw+"','"+req.body.other+"','"+req.body.about+"','"+imgdir+"');"
      connection.query(query, function(err, result){
        if(err){
          console.log(err);

          res.redirect('/profile');
        }
      });
      res.redirect('/main');

    });

    app.get('/profile', async(req,res)=>{
      var username = req.user.USERNAME;
      res.render('profile', {username});
    });
    /*Get an users profile */
    app.get('/profile/:artist', async (req, res) => {
        /*read all data from db*/
        var profile = getprofileinfo(req.params.artist);
        var artist = '../src/public/media_files/'+req.params.artist;
        if(!fs.existsSync(artist)){
          fs.mkdir(artist, {recursive:true}, function(err){
              if(err){
                  console.log(err);
              }else{
                  //console.log('succes ;)');
              }
          });
        }
        usrinfo = {
            usrname: req.params.artist,
            songs:"",
            albums:""
        }

        //obtener albums del artista
        var albums = fs.readdirSync('../src/public/media_files/'+req.params.artist);
        //obtener todas las canciones del artista
        var songs = [];
        albums.forEach(album=>{
            var tmp = fs.readdirSync('../src/public/media_files/'+req.params.artist+'/'+album);
            tmp.forEach(song => {
                songs.push(song.split('.')[0]);
            });
        });
        usrinfo.usrname = req.params.artist;
        usrinfo.songs = songs.length;
        usrinfo.albums = albums.length;
        var editable = false;
        console.log(songs);
        res.render('partials/_profile',{albums, songs, usrinfo, editable, profile});
    });
};

function isLoggedIn(req, res, next){
  if(req.isAuthenticated())
    return next();

  res.redirect('/');
}

function getinfo(){
  if(username == null) return;
  return new Promise(getprofileinfo);
}
//WARNING i'm not so sure this will work
function getprofileinfo(resolve, reject){
  console.log('perofileof: '+ username);
  if(username == null) reject('no user');
  //Select all the account information from the DB according to the required user
  //first query
  connection.query("SELECT * FROM profile WHERE username = '"+username+"'", function(err, result, fields){
      if(err){

        reject(err);
      }else{
        profile.about = result[0].DESC_PROFILE;
        profile.links.iglink = result[0].IG_PROFILE_LINK;
        profile.links.fblink = result[0].FB_PROFILE_LINK;
        profile.links.twlink = result[0].TW_PROFILE_LINK;
        profile.links.olink = result[0].OTHER_LINK;
        profile.imgdir = result[0].DIR_PROFILE_IMG;
        //second query
        //get the number of followers of the account
        connection.query("SELECT count(follower_account_name) AS NFOLLOW FROM followers WHERE username = '"+username+"'",
        function(err, result, fields){
          if(err) reject(err);
          else {
            profile.followers = result[0].NFOLLOW;
            console.log(profile);
            resolve();
          }
        });
      }
  });

}
