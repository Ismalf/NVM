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
      console.log("id: "+id);
      connection.query("SELECT * FROM account WHERE id_account = ? ", [id],
      function(err, rows){
        console.log(err);
        done(err, rows[0]);
      });
    });

    /*REGISTER*/
    passport.use(
      //function name
      'local-signup',
        //unknown purpose (don't modify, just in case)
        new LocalStrategy({
          usernameField : 'username',
          passwordField: 'password',
          nombreField:'name',
          apellidoField:'lastname',
          correoField:'email',
          accounttype:'type',
          passReqToCallback: true
        },
        function(req, username, password, done){
          //validate no other account has the same user name
          connection.query("SELECT * FROM account WHERE username = ? ",
          [username], function(err, rows){
          if(err)
            return done(err);
          if(rows.length){
            return done(null, false, req.flash('signupMessage', 'That username is already taken'));
            //end of validation
          }else{
            //object to keep the data retrieved from the register form
            var newUserMysql = {
              username: username,
              password: bcrypt.hashSync(password, null, null),
              type: req.body.type,
              name: req.body.name,
              lastname: req.body.lastname,
              email: req.body.email
            };
            console.log(newUserMysql);
            //insert into account the data related to the account
            var insertQuery =
            "INSERT INTO account (username, password, type_account, creation_date) values ('"+newUserMysql.username+"','"+newUserMysql.password+"','"+newUserMysql.type+"',DATE(NOW()));";
            console.log(insertQuery);
            connection.query(insertQuery, function(err, result){
              if(err) console.log(err);
              else console.log("result: "+result);
              //asing to the object created earlier the id of the last account created
              newUserMysql.id = result.insertId;
              console.log(newUserMysql.id);
              return done(null, newUserMysql);
            });
            //insert into user the data that's user related
            console.log('second insert');
            insertQuery = "INSERT INTO user (id_account, username, name, lastname, email) values (last_insert_id(),'"+newUserMysql.username+"','"+newUserMysql.name+"','"+newUserMysql.lastname+"','"+newUserMysql.email+"')";
            console.log(insertQuery);
            connection.query(insertQuery, function(err, result){
              //nothing more to do
              if(err) console.log(err);
              else console.log("result: "+result);
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
                console.log(newUserMysql.id);
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
        console.log(username);
        console.log(password);
        var query = "SELECT * FROM account WHERE username = '"+username+"';";
        console.log(query);
        connection.query(query,
        function(err, rows, fields){
          console.log(rows);

          if(err){
            console.log(err);
            return done(err);
          }if(!rows.length){
            return done(null, false, req.flash('loginMessage', 'No User Found'));
          }
          if(!bcrypt.compareSync(password, rows[0].PASSWORD)){
            console.log("incorrect password");
            return done(null, false, req.flash('loginMessage', 'Wrong Password'));
          }
          console.log("ok");
          var newUserMysql = {
            id: rows[0].ID_ACCOUNT,
            username: rows[0].USERNAME,
            password: rows[0].PASSWORD,
            type: rows[0].TYPE_ACCOUNT
          };
          return done(null, newUserMysql);
        });
      })
    );
  };
