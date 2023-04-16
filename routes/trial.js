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
    res.redirect("/survey");
  } else {
    const objectIdMap = req.session.objectIdMap;
    // JSON.stringify does not support map well, so we convert it to an array
    var objectIdArray = [];
    for (var i = 1; i <= 30; i++) {
      objectIdArray.push(objectIdMap[i]);
    }
    const objectIdArrayJSON = JSON.stringify(objectIdArray);

    res.render("trial", {
      id: req.params.id,
      objectIdArray: objectIdArrayJSON,
    });
  }
});

module.exports = router;
