require('dotenv').config();

var Harvest = require('harvest');
var moment = require('moment');

// weekday statutory holidays in Ontario
var dates = [
  '2016-01-1',
  '2016-02-15',
  '2016-03-25',
  '2016-05-23',
  '2016-07-1',
  '2016-08-1',
  '2016-09-5',
  '2016-10-10',
  '2016-12-26',
];

var harvest = new Harvest({
  subdomain: process.env.SUBDOMAIN,
  email: process.env.EMAIL,
  password: process.env.PASSWORD,
});

var TimeTracking = harvest.TimeTracking;

var entryCreationRequests = dates.map(function (date) {
  return new Promise(function (resolve, reject) {

    TimeTracking.create({
      hours: 8,
      project_id: process.env.PROJECT_ID,
      task_id: process.env.TASK_ID,
      notes: 'STAT HOLIDAY',
      spent_at: moment(date, moment.ISO_8601).format('ddd, D MMM YYYY')
    }, function (err, timer, response) {
      if (err) {
        console.error(err)
        reject(err);
      } else {
        console.log('registered entry for: ', timer.spent_at, ', timer id: ', timer.id);
        resolve(timer);
      }
    });

  });
});

Promise.all(entryCreationRequests)
  .then(function () {
    console.log('all done');
  });