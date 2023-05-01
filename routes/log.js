var express = require("express");
var router = express.Router();
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));

router.post("/trial/:id", function (req, res, next) {
  const uid = req.session.uid;
  const id = parseInt(req.params.id);
  const name = req.session.name;

  // Parse data from the request
  const dataJson = req.body.data;
  const data = JSON.parse(dataJson);

  const firstTimeWrite = !fs.existsSync("logs/trial.csv");
  csvWriter = createCsvWriter({
    path: "logs/trial.csv",
    header: [
      { id: "uid", title: "uid" },
      { id: "name", title: "name" },
      { id: "trial_id", title: "trial_id" },
      { id: "object_id", title: "object_id" },
      { id: "x", title: "x" },
      { id: "y", title: "y" },
    ],
    append: !firstTimeWrite,
  });

  records = [];
  for (const d of data) {
    records.push({ ...JSON.parse(d), uid: uid, name: name });
  }
  csvWriter
    .writeRecords(records)
    .then(() => res.redirect("/trial/" + (id + 1)));
});

router.post("/describe/:id", function (req, res, next) {
  const id = parseInt(req.params.id);
  const objectId = req.session.objectIdMap[id];
  const uid = req.session.uid;
  const name = req.session.name;
  const firstTimeWrite = !fs.existsSync("logs/describe.csv");
  csvWriter = createCsvWriter({
    path: "logs/describe.csv",
    header: [
      { id: "uid", title: "uid" },
      { id: "name", title: "name" },
      { id: "object_id", title: "object_id" },
      { id: "seen", title: "seen" },
      { id: "description", title: "description" },
    ],
    append: !firstTimeWrite,
  });

  const records = [
    {
      uid: uid,
      name: name,
      object_id: objectId,
      seen: req.body.seen,
      description: req.body.description,
    },
  ];
  csvWriter
    .writeRecords(records)
    .then(() => res.redirect("/describe/" + (id + 1)));
});

router.post("/survey", function (req, res, next) {
  const uid = req.session.uid;
  const name = req.session.name;
  const firstTimeWrite = !fs.existsSync("logs/survey.csv");
  csvWriter = createCsvWriter({
    path: "logs/survey.csv",
    header: [
      { id: "uid", title: "uid" },
      { id: "name", title: "name" },
      { id: "gender", title: "gender" },
      { id: "gender_self_describe", title: "gender_self_describe" },
      { id: "race", title: "race" },
      { id: "race_self_describe", title: "race_self_describe" },
      { id: "age", title: "age" },
      { id: "english_native", title: "english_native" },
      { id: "native_language", title: "native_language" },
    ],
    append: !firstTimeWrite,
  });

  const records = [
    {
      uid: uid,
      name: name,
      gender: req.body.gender,
      gender_self_describe: req.body.gender_self_describe,
      race: req.body.race,
      race_self_describe: req.body.race_self_describe,
      age: req.body.age,
      english_native: req.body.english_native,
      native_language: req.body.native_language,
    },
  ];

  csvWriter.writeRecords(records).then(() => res.redirect("/survey/completed"));
});

module.exports = router;
