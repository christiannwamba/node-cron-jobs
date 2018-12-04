const fs = require("fs");
let shell = require("shelljs");
const cron = require("node-cron");
const express = require("express");
let nodemailer = require("nodemailer");

app = express();

// query parking status from SQlite
const getParkingStatus = () => {
    //replace this with a SQlite query
    return 2;
};

// tzone configs
const zonesNearHome = [
    {
        id: 1,
        desc: 'N. Page',
        fequency: 'Tuesdays at 12pm',
        dayBeforeReminder: '* 19 * * Monday',  // every Monday at 7pm
        morningOfReminder: '* 7 * * Tuesday'  // every Tuesday at 7am
    }, {
        id: 2,
        desc: 'S. Page',
        fequency: 'Thursdays at 8am',
        dayBeforeReminder: '* 19 * * Wednesday',  // every Wednesday at 7pm
        morningOfReminder: '* 7 * * Thursday',  // every Thursday at 7am
    }, {
        id: 3,
        desc: 'W. Pierce',
        fequency: 'Fridays at 9am',
        dayBeforeReminder: '* 19 * * Thursday',  // every Thursday at 7pm
        morningOfReminder: '* 7 * * Friday'  // every Friday at 7am
    }, {
        id: 4,
        desc: 'E. Pierce',
        fequency: 'Wednesdays at 9am',
        dayBeforeReminder: '* 19 * * Tuesday',  // every Tuesday at 7pm
        morningOfReminder: '* 7 * * Wednesday'  // every Wednesday at 7am
    }
];
const zonesNearHomeTEST = [
    {
        id: 1,
        desc: 'N. Page',
        fequency: 'Tuesdays at 12pm',
        dayBeforeReminder: '*/30 * * * * *',  // every Monday at 7pm
        morningOfReminder: '*/31 * * * * *'  // every Tuesday at 7am
    }, {
        id: 2,
        desc: 'S. Page',
        fequency: 'Thursdays at 8am',
        dayBeforeReminder: '*/5 * * * * *',  // every Wednesday at 7pm
        morningOfReminder: '*/6 * * * * *',  // every Thursday at 7am
    }
];

// create mail transporter
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "parking.budddy@gmail.com",
    pass: "noMOREt1ick3ts"
  }
});

// setup cron jobs for configured zones
for(id in zonesNearHomeTEST) {
    const zone = zonesNearHomeTEST[id];
    cron.schedule(zone.dayBeforeReminder, function() {
        if(getParkingStatus() === zone.id) {
            // send email for day before reminder
            // light up warning lights
        } 
    });
    cron.schedule(zone.morningOfReminder, function() {
        if(getParkingStatus() === zone.id) {
            // send email for morning of reminder
            // light up warning lights
        } 
    });
}

app.listen("2319");

// copy this into the action, example

// transporter.sendMail({
//     from: "parking.budddy@gmail.com",
//     to: "parking.budddy@gmail.com",
//     subject: `Testing cron job`,
//     text: `Hi there, this email was automatically sent by PB ;)`
//   }, function(error, info) {
//   if (error) {
//     throw error;
//   } else {
//     console.log("Email sent");
//   }
// });

