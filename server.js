const express = require('express');
const TinyUrl = require("./models/tinyUrlModel.js");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const shortid = require('shortid');

const app = express();

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.set("view engine", "ejs");

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/tinyurl');

app.get("/", (req, res) => {
  res.render("index.html.ejs");
});

app.route("/new/*")

  .get((req, res) => {
    console.log(req.params.link);
    const shortId = shortid.generate();
    const tinyUrl = "http://localhost:3000/"+shortId;
    const originalUrl = req.params[0];
    console.log("original URL: ", originalUrl);
    TinyUrl.findOne({originalUrl: originalUrl}, (err, url) => {
      if (url) {
        alert("URL already exist: " + url.shortId);
        res.redirect("/" + url.shortId);

      } else {
        let json = {  
          "originalUrl": originalUrl, 
          "tinyUrl": tinyUrl,
          "shortId": shortId
        };

        const newUrl = new TinyUrl(json);

        newUrl.save((err, url) => {
          if (err) return res.send(err);
          console.log(url + " saved to db");
        });

        res.json(json);
      }
    });
  
});

app.get("/showlinks", (req, res) => {
  TinyUrl.find({}, (err, url) => {
    if (err) return res.send(err);
    res.json(url);
  });
});

app.get("/:link", (req, res) => {
  TinyUrl.findOne({shortId: req.params.link}, (err, url) => {
    if (err) return res.send(err);
    console.log(url);
    res.redirect(url.originalUrl);
  });
});

app.listen(3000, () => {
  console.log("listening on 3000");
});