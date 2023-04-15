var express = require("express");
var router = express.Router();
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));

/* POST log listing. */
router.post("/", function (req, res, next) {
  const uid = req.session.uid;
  const data = req.body.data;

  if (!fs.existsSync("logs")) {
    fs.mkdirSync("logs");
  }
  csvWriter = createCsvWriter({
    path: "logs" + uid + ".csv",
    header: [
      { id: "page", title: "page" },
      { id: "img_id", title: "img_id" },
      { id: "x", title: "x" },
      { id: "y", title: "y" },
    ],
    append: true,
  });
  csvWriter.writeRecords(data); // returns a promise
});

router.post("/describe/:id", function (req, res, next) {
  const id = parseInt(req.params.id);
  if (id > 0) {
    // 0 represents the example, there is nothing to log
    const uid = req.session.uid;
    csvWriter = createCsvWriter({
      path: "logs/describe.csv",
      header: ["uid", "object_id", "seen", "description"],
      append: true,
    });

    const records = [
      {
        uid: uid,
        object_id: id,
        seen: req.body.seen,
        description: req.body.description,
      },
    ];
    csvWriter.writeRecords(records);
  }

  res.redirect("/describe/" + (id + 1));
});

module.exports = router;
