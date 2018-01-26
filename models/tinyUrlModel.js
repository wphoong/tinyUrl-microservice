"use strict";

const mongoose = require('mongoose');
const shortid = require('shortid');
const Schema = mongoose.Schema;

const TinyUrlSchema = new Schema({
  "originalUrl": String,
  "tinyUrl": {
      type: String,
      'default': shortid.generate
    },
  "shortId": String
});

module.exports = mongoose.model("TinyUrl", TinyUrlSchema);