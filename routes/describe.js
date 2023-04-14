var express = require("express");
var router = express.Router();
var path = require("path");

/* Point to the public folder. */
router.use(express.static("public"));

/* GET trial page. */
router.get("/intro", function (req, res, next) {
  res.render("describe_intro");
});

module.exports = router;
