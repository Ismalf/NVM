var LocalStrategy = require("passport-local").Strategy;

var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

module.exports = function(passport) {
 passport.serializeUser(function(user, done){
  done(null, user.id);
 });

 passport.deserializeUser(function(id, done){
  connection.query("SELECT * FROM users WHERE id = ? ", [id],
   function(err, rows){
    done(err, rows[0]);
   });
 });

 passport.use(
  'local-signup',
  new LocalStrategy({
    usernameField : 'username',
    passwordField: 'password',
    nombreField:'nombre',
    apellidoField:'apellido',
    correoField:'correo',
    telefonoField: 'telefono',
    passReqToCallback: true
 },
 function(req, username, password, done){
  connection.query("SELECT * FROM users WHERE username = ? ",
  [username], function(err, rows){
   if(err)
    return done(err);
   if(rows.length){
    return done(null, false, req.flash('signupMessage', 'That is already taken'));
   }else{
    var newUserMysql = {
     username: username,
     password: bcrypt.hashSync(password, null, null),
     nombre: req.body.nombre,
     apellido:req.body.apellido,
     correo:req.body.correo,
     telefono: req.body.telefono
    };

    var insertQuery = "INSERT INTO users (username, password,nombre,apellido,correo,telefono) values (?,?,?,?,?,?)";

    connection.query(insertQuery, [[newUserMysql.username], [newUserMysql.password],[newUserMysql.nombre], [newUserMysql.apellido],[newUserMysql.correo], [newUserMysql.telefono]],
     function(err, rows){
      newUserMysql.id = rows.insertId;

      return done(null, newUserMysql);
     });
   }
    });
   })
  );
  passport.use(
   'local-signup1',
   new LocalStrategy({
    usernameField : 'usernameE',
   passwordField: 'passwordE',
   nombreField:'nombreE',
   correoField:'correoE',
   telefonoField: 'telefonoE',
   passReqToCallback: true
  },
  function(req, username, password, done){
   connection.query("SELECT * FROM users WHERE username = ? ",
   [username], function(err, rows){
    if(err)
     return done(err);
    if(rows.length){
     return done(null, false, req.flash('signupMessage', 'That is already taken'));
    }else{
     var newUserMysql = {
      username: req.body.nombreE,
      password: bcrypt.hashSync(password, null, null),
      nombre: req.body.nombreE,
      correo:req.body.correoE,
      telefono: req.body.telefonoE
     };

     var insertQuery = "INSERT INTO users (username, password,nombreEm,correo,telefono) values (?,?,?,?,?)";

     connection.query(insertQuery, [[newUserMysql.username], [newUserMysql.password],[newUserMysql.nombre],[newUserMysql.correo], [newUserMysql.telefono]],
      function(err, rows){
       newUserMysql.id = rows.insertId;

       return done(null, newUserMysql);
      });
    }
     });
    })
   );

 passport.use(
  'local-login',
  new LocalStrategy({
   usernameField : 'username',
   passwordField: 'password',
   passReqToCallback: true
  },
  function(req, username, password, done){
   connection.query("SELECT * FROM users WHERE username = ? ", [username],
   function(err, rows){
    if(err)
     return done(err);
    if(!rows.length){
     return done(null, false, req.flash('loginMessage', 'No User Found'));
    }
    if(!bcrypt.compareSync(password, rows[0].password))
     return done(null, false, req.flash('loginMessage', 'Wrong Password'));

    return done(null, rows[0]);
   });
  })
 );
};
