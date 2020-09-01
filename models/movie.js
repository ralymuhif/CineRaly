const mongoose = require("mongoose");
const path = require("path");

const coverImageBasePath = "uploads/movieCovers";

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  length: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  coverImageName: {
    type: String,
    required: true,
  },
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Genre",
  },
});

movieSchema.virtual("coverImagePath").get(function () {
  if (this.coverImageName != null) {
    return path.join("/", coverImageBasePath, this.coverImageName);
  }
});

module.exports = mongoose.model("Movie", movieSchema);
module.exports.coverImageBasePath = coverImageBasePath;
