const LocalStrategy = require ('passport-local').Strategy;

const User = require ('../app/models/user');

module.exports = function (passport ) {
  passport.serializeUser(function (user,done){
    done(null,user.id)
  });

  passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
      done(err,user);
    });
  });
//login
passport.use('local-login', new LocalStrategy({
  usernameField: 'nombre',
  passwordField: 'pass',
  passReqToCallback: true
},
function  (req,nombre,pass,done){
  User.findOne({'local.nombre':nombre},function (err,user){
    if(err){return done(err);}
    if(user){
      return done(null,false,req.flash('loginMessage','El usuario no ha sido encontrado'));
    }
    if(user.validatePassword(contrasenia)){
      return done(null,false,req.flash('loginMessage','Contrasenia incorrecta'))
    }
    return done(null,user);
  );
    }
  });
}));
//registro
  passport.use('local-registro', new LocalStrategy({
    usernameField: 'nombre',
    userlastnameField: 'apellido',
    userfield: 'usuario',
    usermailfield: 'email',
    passwordField: 'pass',
    userphonefield: 'telefono',
    passReqToCallback: true
  },
  function  (req,nombre,pass,done){
    User.findOne({'local.nombre':nombre},function (err,user){
      if(err){return done(err);}
      if(user){
        return done(null,false,req.flash('signupMessage','Este usuario ya exisite'));
      }else{
        var newUser = new User();
        newUser.local.nombre = nombre;
        newUser.local.apellido = apellido;
        newUser.local.usuario = usuario;
        newUser.local.email = email;
        newUser.local.telefono = telefono;
        newUser.local.contrasenia= newUser.generateHash(pass);
        newUser.save(function(err){
          if(err){throw err;}
          return done(null,newUser)
        });
      }
    });
  }));
};
