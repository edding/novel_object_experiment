var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.render("survey");
});

router.get("/completed", function (req, res, next) {
  res.render("completed");
});

module.exports = router;
