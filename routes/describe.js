var express = require("express");
var router = express.Router();
var path = require("path");

/* Point to the public folder. */
router.use(express.static("public"));

router.get("/intro", function (req, res, next) {
  res.render("describe_intro");
});

router.get("/example", function (req, res, next) {
  res.render("describe_example");
});

router.get("/:id", function (req, res, next) {
  if (req.params.id > 30) {
    res.redirect("/trial/intro");
  }
  objectId = req.session.objectIdMap[req.params.id];
  res.render("describe", { id: req.params.id, objectId: objectId });
});

module.exports = router;
