var nodemailer = require('nodemailer');
module.exports=(app,passport)=>{
  app.get('/',(req,res)=>{
    res.render('index');
  });
  app.get('/main',(req,res)=>{
    res.render('main');
  });
  app.get('/login',(req,res)=>{
    res.render('login',{
      message: req.flash('loginMessage')
    });
  });
  //app.post('/login',passport.authenticate(''));
  app.get('/registro',(req,res)=>{
    res.render('registro',{
      message: req.flash('signupMessage')
    });
  });
  app.post('/registro',passport.authenticate('local-registro',{
    successRedirect: '/profile',
    failureRedirect: '/registro',
    failureFlash: true
  }));

  app.get('/profile',(req,res)=>{
    res.render('profile',{
      user: req.user
    });
  });
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
};
