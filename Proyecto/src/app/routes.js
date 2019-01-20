var nodemailer = require('nodemailer');
const express=require('express');
//para subir archivos
var formidable = require('formidable');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file,cb){
        cb(null,'../src/public/media_files/tmp')
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});
var upload = multer({storage:storage});
var fs=require('fs');

module.exports=(app,passport)=>{
    app.get('/',(req,res)=>{
        res.render('index');
    });

    app.get('/main', isLoggedIn, function(req, res){
        res.render('main', {
        user:req.user
        });
    });
    app.get('/login', function(req, res){
        res.render('login', {message:req.flash('loginMessage')});
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/main/albums',
        failureRedirect: '/login',
        failureFlash: true
        }),
        function(req, res){
        if(req.body.remember){
        req.session.cookie.maxAge = 1000 * 60 * 3;
        }else{
        req.session.cookie.expires = false;
        }
        res.redirect('/login');
    });

    app.get('/registro', function(req, res){
        res.render('registro', {message: req.flash('signupMessage')});
    });

    app.post('/registro1', passport.authenticate('local-signup', {
        successRedirect: '/main/albums',
        failureRedirect: '/registro',
        failureFlash: true
    }));
    app.post('/registro2', passport.authenticate('local-signup1', {
        successRedirect: '/main/albums',
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
    //-------------------------------------------------------------------------------------------------------------
        var artist_album_song = '../src/public/media_files/'+req.body.artist+'/'+req.body.album;

        if(!fs.existsSync(artist_album_song)){
            //console.log('creating directory');
            fs.mkdir(artist_album_song, {recursive:true}, function(err){
                if(err){
                    console.log(err);
                }else{
                    //console.log('succes ;)');
                }
            });
        } 

        req.files.forEach((file)=>{
            fs.rename('../src/public/media_files/tmp/'+file.originalname,artist_album_song+'/'+file.originalname, function(err){
                if(err){
                    console.log(err);
                }else{
                    //console.log('success');
                }
            });    
        });
        res.redirect('profile');

    }); 
    app.get('/profile', async (req, res) => {
        //var files;

        res.render('profile');
    });

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
        res.render('main',{topalbums, title, artists, topsongs});
    });

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
        res.render('main',{topalbums, title, artists, topsongs});
    });

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
        res.render('main',{topalbums, title, artists, topsongs});
    }); 

    //------------------- Get Album Playlist ------------------------------------------
    app.get('/main/:artist/:album', async (req, res) => {
        var content = fs.readdirSync('../src/public/media_files/'+req.params.artist+'/'+req.params.album);
        var songs = [];
        content.forEach(file=>{
           songs.push('../media_files/'+req.params.artist+'/'+req.params.album+'/'+file);
        });
        console.log(songs);
        res.send(songs);
    }); 

};

function isLoggedIn(req, res, next){
 if(req.isAuthenticated())
  return next();

 res.redirect('/');
}



                                        
