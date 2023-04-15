var express = require("express");
var router = express.Router();
var path = require("path");

/* Point to the public folder. */
router.use(express.static("public"));

router.get("/intro", function (req, res, next) {
  res.render("trial_intro");
});

router.get("/example", function (req, res, next) {
  res.render("trial_example", { id: 0, isExample: true });
});

router.get("/:id", function (req, res, next) {
  if (req.params.id > 6) {
    res.redirect("/completed");
  } else {
    res.render("trial", { id: req.params.id });
  }
});

module.exports = router;
