const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const TaskSchema = new Schema({
  nomEmp: String,
  usuEmp: String,
  passEmp: String,
  rpassEmp: String,
  correoEmp: String,
  telfEmp: String
});

module.exports = mongoose.model('empresas',TaskSchema);
