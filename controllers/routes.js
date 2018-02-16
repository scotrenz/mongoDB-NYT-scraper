const express = require("express");
const router = express.Router();
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");
const mongoose = require("mongoose");


router.get("/", function (req, res) {
    db.Article
        .find({})
        .then(function (dbArticles) {
            const data = {
                articles: dbArticles
            }
            res.render("home", data);
        });
});

router.get("/save/article/:id", function (req, res) {

    db.Article
        .findOne({ _id: req.params.id })
        .then(function (data) {
            var savedArticle = {
                headline: data.headline,
                summary: data.summary,
                URL: data.URL,
                image: data.image
            }
            db.Saved.create(savedArticle)
        })
});

router.get("/saved", function (req, res) {
    db.Saved
        .find({})
        .then(function (savedArticles) {
            var data = {
                saved: savedArticles
            }
            res.render("saved", data);
        });
});

router.get("/note/:id", function (req, res) {
    db.Saved
        .find({ _id: req.params.id })
        .populate("notes.note")
        .then(function (data) {
            console.log(data[0].notes)
            let notes = [];
            data[0].notes.forEach(element => {
                //console.log(element._id);
                notes.push({
                    body: element.note.body,
                    id: element.note._id
                })
            });
            res.json(notes)
        })
})

router.put("/article/delete/:id", function (req, res) {
    db.Saved
        .deleteOne({ _id: req.params.id })
        .then(function (confirm) {
            res.json("conirm");
        })
    //TODO: Delete notes that belong to article
    // .find({ _id: req.params.id })
    // .then(function (data) {
    //     data[0].notes.forEach(note => {
    //         db.Note.deleteOne({ _id: note._id })
    //     })
    // })
    // .then(function (result) {
    //     db.Saved
    //         .deleteOne({ _id: req.params.id });
    //     res.json("Done");
    // })
})

router.put("/note/delete/:id", function (req, res) {
    console.log(req.params.id)
    db.Note
        .deleteOne({_id: req.params.id})
        .then(function(del){
            res.json("deleted")
            console.log("deleted")
        })
})
router.post("/note/create/:id", function (req, res) {
    db.Note
        .create(req.body)
        .then(function (dbNote) {
            return db.Saved.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: { note: dbNote._id } } }, { new: true });
        })
        .then(function (dbArticle) {
            console.log(dbArticle)
            res.json(dbArticle);
        })
})

router.get("/api/scrape", function (req, res) {
    axios.get("https://www.nytimes.com/section/technology?action=click&pgtype=Homepage&region=TopBar&module=HPMiniNav&contentCollection=Tech&WT.nav=page").then(function (response) {

        const $ = cheerio.load(response.data);

        let results = [];
        $("div.stream article.story.theme-summary").each(function (i) {
            //delete from database

            const headline = $(this).find("h2.headline").text().trim();

            const summary = $(this).find("p.summary").text();

            const URL = $(this).find("a.story-link").attr("href");

            const image = $(this).find("img").attr("src");

            results.push({
                headline: headline,
                summary: summary,
                URL: URL,
                image: image
            });

            db.Article.create(results[i]);
        });
        res.json(results.length);
    });
});

module.exports = router;