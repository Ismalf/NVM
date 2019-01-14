const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const SongSchema = new Schema({
    title: String,
    album_code: String,
    location: String,
    year: String
});
module.exports = mongoose.model('songs', SongSchema);