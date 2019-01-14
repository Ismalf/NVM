const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const AlbumSchema = new Schema({
    title: String,
    album_code: String,
    location: String,
    img_location: String
});
module.exports = mongoose.model('albums', AlbumSchema);