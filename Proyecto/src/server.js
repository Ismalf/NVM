const express = require ('express')
const app=express();
const path=require('path');
const mongoose =require('mongoose');
const passport=require ('passport');
const flash=require('connect-flash');
const morgan=require('morgan');
const cookieParser = require ('cookie-parser');
const bodyParser=require('body-parser');
const session=require('express-session');
var formidable = require('formidable');
var nodemailer = require('nodemailer');

require('./config/passport')(passport);
//configuraciones
app.set('port',process.env.PORT || 3000);
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

//midelware
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
 extended: true
}));
app.use(session({
 secret: 'justasecret',
 resave:true,
 saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//indexRouter
require('./app/routes')(app,passport);
//archivos estaticos

app.use(express.static(path.join(__dirname,'public')))
 app.listen(app.get('port'),()=>{
   console.log('server on port',app.get('port'));
 });
