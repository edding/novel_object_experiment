var express = require('express');
var router = express.Router();
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');


/* POST log listing. */
router.post('/', function(req, res, next) {
    const data = req.body.data;
    
    if (!fs.existsSync('student_logs')) {
        fs.mkdirSync('student_logs');
    }
    csvWriter = createCsvWriter({
        path: 'student_logs/student1' + '.csv',
        header: [
            {id: 'page', title: 'page'},
            {id: 'img_id', title: 'img_id'},
            {id: 'x', title: 'x'},
            {id: 'y', title: 'y'},
        ],
        append: true
    });
    csvWriter.writeRecords(data)       // returns a promise
});

module.exports = router;
