var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var Handlebars = require("handlebars");
const mongoose = require("mongoose");

var MONGODB_URI = process.env.MONGODB_URI || "https://cryptic-meadow-65056.herokuapp.com";

mongoose.connect("MONGODB_URI", {
    useMongoClient: true
});

//For testing
// mongoose.Promise = Promise;
// mongoose.connect("mongodb://localhost/newyorktimes", {
//   useMongoClient: true
// });

var db = mongoose.connection;

db.on("error", function (error) {
    console.log("Mongoose Error: ", error);
});

db.once("open", function () {
    console.log("Mongoose connection successful.");
});

var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var routes = require("./controllers/routes.js");

app.use("/", routes);

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});

