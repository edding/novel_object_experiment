var express = require("express");
var router = express.Router();
var session = require("express-session");

// TODO: Randomize the order of the objects and keep it in a session
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
  res.redirect("/describe/intro");
});

module.exports = router;
