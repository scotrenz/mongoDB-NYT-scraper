var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var savedSchema = new Schema({
    headline: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    URL: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    notes: [{
        note: {
            type: Schema.Types.ObjectId,
            ref: "Note"
        }
    }]
});

var SavedArticles = mongoose.model("SavedArticles", savedSchema);

module.exports = SavedArticles;
