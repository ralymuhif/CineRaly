const express = require("express");
const router = express.Router();
const Movie = require("../models/movie");
const Genre = require("../models/genre");
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];

// All Movies Route
router.get("/", async (req, res) => {
  let query = Movie.find();
  if (req.query.title != null && req.query.title != "") {
    query = query.regex("title", new RegExp(req.query.title, "i"));
  }
  if (req.query.releasedBefore != null && req.query.releasedBefore != "") {
    query = query.lte("releaseDate", req.query.releasedBefore);
  }
  if (req.query.releasedAfter != null && req.query.releasedAfter != "") {
    query = query.gte("releaseDate", req.query.releasedAfter);
  }
  try {
    const movies = await query.exec();
    res.render("movies/index", {
      movies: movies,
      searchOptions: req.query,
    });
  } catch {
    res.redireect("/");
  }
});

// New Movie Route
router.get("/new", async (req, res) => {
  renderNewPage(res, new Movie());
});

// Create Movie Route
router.post("/", async (req, res) => {
  const movie = new Movie({
    title: req.body.title,
    genre: req.body.genre,
    releaseDate: new Date(req.body.releaseDate),
    length: req.body.length,
    description: req.body.description,
  });
  saveCover(movie, req.body.cover);
  try {
    const newMovie = await movie.save();
    // res.redirect("movies/${newMovie.id}");
    res.redirect("movies");
  } catch {
    renderNewPage(res, movie, true);
  }
});

async function renderNewPage(res, movie, hasError = false) {
  try {
    const genres = await Genre.find({});
    const params = {
      genres: genres,
      movie: movie,
    };
    if (hasError) params.errorMessage = "Error Creating Movie";
    res.render("movies/new", params);
  } catch {
    res.redirect("/movies");
  }
}

function saveCover(movie, coverEncoded) {
  if (coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    movie.coverImage = new Buffer.from(cover.data, "base64");
    movie.coverImageType = cover.type;
  }
}

module.exports = router;
