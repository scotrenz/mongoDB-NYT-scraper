var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
    body: String
});
//note reference article

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
