const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  cover: {
    type: String,
    required: true,
  },
  content: [],
  likes: [String],
  web: {
    type: Number,
    required: true,
  },
  chain: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", postSchema);
