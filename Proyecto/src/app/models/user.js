const mongoose = require('mongoose');
const bcrypt=require('bcrypt-nodejs');

//esquema de como se guardan los dato del login
const userSchema=new mongoose.Schema({
  local:{
    nombre: String,
    apellido: String,
    usuario: String,
    contrasenia: String,
    email: String,
    telefono: String
  }
});
//cifra la constrasenia antes de ingresar a la base de datos
userSchema.methods.generateHash = function (contrasenia){
  return bcrypt.hashSync(contrasenia,bcrypt.genSaltSync(8),null);
};
//verificar si la contrasenia es la correcta
userSchema.methods.validatePassword=function (contrasenia){
  return bcrypt.compareSync(contrasenia,this.local.contrasenia);
};

module.exports = mongoose.model('User',userSchema);
