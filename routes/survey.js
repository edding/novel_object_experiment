var express = require("express");
var router = express.Router();

var path = require("path");

/* Point to the public folder. */
router.use(express.static("public"));

router.get("/", function (req, res, next) {
  res.render("survey");
});

router.get("/completed", function (req, res, next) {
  res.render("completed");
});

module.exports = router;
