const express = require("express");
const router = express.Router();
const Genre = require("../models/genre");

// All Genres Route
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    const genres = await Genre.find(searchOptions);
    res.render("genres/index", { genres: genres, searchOptions: req.query });
  } catch {
    res.redirect("/");
  }
});

// New Genre Route
router.get("/new", (req, res) => {
  res.render("genres/new", { genre: new Genre() });
});

// Create Genre Route
router.post("/", async (req, res) => {
  const genre = new Genre({
    name: req.body.name,
  });
  try {
    const newGenre = await genre.save();
    //  res.redirect("genre/${newGenre.id}");
    res.redirect("genres");
  } catch {
    res.render("genres/new", {
      genre: genre,
      errorMessage: "Error creating Genre",
    });
  }
});

module.exports = router;
