var express = require("express");
var router = express.Router();

/* GET trial page. */
router.get("/", function (req, res, next) {
  res.render("trial", { title: "Novel Object Trial" });
});

module.exports = router;
