var express = require("express");
var router = express.Router();
var session = require("express-session");

router.use(
  session({
    secret: "novel_object_session",
    resave: false,
    saveUninitialized: true,
  })
);

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

/* POST home page, save uid in session */
router.post("/", function (req, res, next) {
  req.session.uid = req.body.uid;
  req.session.name = req.body.name;

  // Shuffle object ids and build a map from index to object id
  var randomizedObjectIds = [];
  for (var i = 1; i <= 30; i++) {
    randomizedObjectIds.push(i);
  }
  randomizedObjectIds.sort(() => Math.random() - 0.5);
  objectIdMap = {};
  for (var i = 0; i < randomizedObjectIds.length; i++) {
    objectIdMap[i + 1] = randomizedObjectIds[i];
  }

  // Store the map in the session so that it is consistent across pages
  req.session.objectIdMap = objectIdMap;

  res.redirect("/describe/intro");
});

module.exports = router;
