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

// Local DB
// mongoose.connect('mongodb://localhost/tinyurl');
// const dbs = require("./config/db.js");
// mongoose.connect(dbs.url);

// MongoLab
var url = process.env.MONGOLAB_URI;

mongoose.connect(url);

app.get("/", (req, res) => {
  res.render("index.html.ejs");
});

app.route("/new/*")

  .get((req, res) => {
    const shortId = shortid.generate();
    const tinyUrl = req.get('host') + "/" + shortId;
    const originalUrl = req.params[0];
    console.log("original URL: ", originalUrl);
    
    TinyUrl.findOne({originalUrl: originalUrl}, (err, url) => {
      if (url) {
        console.log(url);
        res.json(url);
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

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("listening on 3000");
});