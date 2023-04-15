var express = require("express");
var router = express.Router();
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/trial/:id", function (req, res, next) {
  const uid = req.session.uid;
  const id = parseInt(req.params.id);

  // Parse data from the request
  const dataJson = req.body.data;
  const data = JSON.parse(dataJson);

  const firstTimeWrite = !fs.existsSync("logs/trial.csv");
  csvWriter = createCsvWriter({
    path: "logs/trial.csv",
    header: [
      { id: "uid", title: "uid" },
      { id: "trial_id", title: "trial_id" },
      { id: "object_id", title: "object_id" },
      { id: "x", title: "x" },
      { id: "y", title: "y" },
    ],
    append: !firstTimeWrite,
  });

  records = [];
  for (const d of data) {
    records.push({ ...JSON.parse(d), uid: uid });
  }
  csvWriter
    .writeRecords(records)
    .then(() => res.redirect("/trial/" + (id + 1)));
});

router.post("/describe/:id", function (req, res, next) {
  const id = parseInt(req.params.id);
  if (id > 0) {
    // 0 represents the example, there is nothing to log
    const uid = req.session.uid;
    const firstTimeWrite = !fs.existsSync("logs/describe.csv");
    csvWriter = createCsvWriter({
      path: "logs/describe.csv",
      header: [
        { id: "uid", title: "uid" },
        { id: "object_id", title: "object_id" },
        { id: "seen", title: "seen" },
        { id: "description", title: "description" },
      ],
      append: !firstTimeWrite,
    });

    const records = [
      {
        uid: uid,
        object_id: id,
        seen: req.body.seen,
        description: req.body.description,
      },
    ];
    csvWriter
      .writeRecords(records)
      .then(() => res.redirect("/describe/" + (id + 1)));
  } else {
    res.redirect("/describe/" + (id + 1));
  }
});

router.post("/survey", function (req, res, next) {
  const uid = req.session.uid;
  const firstTimeWrite = !fs.existsSync("logs/survey.csv");
  csvWriter = createCsvWriter({
    path: "logs/survey.csv",
    header: [
      { id: "uid", title: "uid" },
      { id: "gender", title: "gender" },
      { id: "age", title: "age" },
      { id: "email", title: "email" },
    ],
    append: !firstTimeWrite,
  });

  const records = [
    {
      uid: uid,
      gender: req.body.gender,
      age: req.body.age,
      email: req.body.email,
    },
  ];

  csvWriter.writeRecords(records).then(() => res.redirect("/survey/completed"));
});

module.exports = router;
