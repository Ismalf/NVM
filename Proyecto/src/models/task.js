const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const TaskSchema = new Schema({
  nombre: String,
  apellido: String,
  usuario: String,
  pass: String,
  repetpass: String,
  correo: String,
  telefono: String
});
module.exports = mongoose.model('usuarios',TaskSchema);
