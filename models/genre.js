const mongoose = require("mongoose");
const Movie = require("./movie");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

genreSchema.pre("remove", function (next) {
  Movie.find({ genre: this.id }, (err, movies) => {
    if (err) {
      next(err);
    } else if (movies.length > 0) {
      next(new Error("This genre has movies still"));
    } else {
      next();
    }
  });
});

module.exports = mongoose.model("Genre", genreSchema);
