const express=require('express');
const router=express.Router();
const Task = require('../models/task');
const Task2 = require('../models/task2');
const Songs = require('../models/song');
const Albums = require('../models/album');
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

router.get('/', async (req, res) => {
    const tasks = await Task.find();
    console.log(tasks);
    res.render('index',{tasks});
});

//REGISTRO USUARIOS
router.post('/addU', async (req, res) => {
    console.log(req.doby);
    const task = new Task(req.body);
    await task.save();
    res.redirect('/');
});
//REGISTRO EMPRESAS
router.post('/addE', async (req, res) => {
    console.log(req.doby);
    const task = new Task2(req.body);
    await task.save();
    res.redirect('/');
});
//////////////////////////////////////////////////
router.get('/confU/:id' , async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id);
  res.render('confU' , {task});
});
//VERIFICAR USUARIO
router.post('/confU', async (req, res) => {
    const task = new Task(req.body);
    await task.save();
    res.redirect('/');
});

//////////////////////////////////////////////////
router.get('/edit/:id' , async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id);
  res.render('edit' , {task});
});
router.post('/edit/:id' , async (req, res) => {
  const { id } = req.params;
  await Task.update({_id: id}, req.body);
  res.redirect('/');
});
router.get('/delete/:id', async (req, res) => {
  const { id } = req.params;
  await Task.remove({_id: id});
  res.redirect('/');
});

//--------------------------------------------------- Upload ------------------------------------------------------

router.post('/upload_media', upload.any(), function (req, res)  {
    
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
router.get('/profile', async (req, res) => {
    //var files;
    fs.readdir('../media_files', function(err, files){
        if(err){
            console.log(err);
        }
        files.forEach(file=>{
           console.log(file); 
        });
    });
    res.render('profile');
});

router.get('/main/albums', async (req, res) => {
    fs.readdir('../src/public/media_files/Top/Top Albums', function(err, albums){
        if(err){console.log(err);}
        var title = 'Top Albums';
        res.render('main',{albums, title});
    });
});

router.get('/main/popartists', async (req, res) => {
    fs.readdir('../src/public/media_files', function(err, files){
        if(err){console.log(err);}
        var albums = [];
        files.forEach(album =>{
           if(album!='tmp' && album!='Top') albums.push(album);
        });
        var title = 'Top Artists';
        res.render('main',{albums, title});
    });
});

module.exports = router;
