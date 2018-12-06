const cron = require("node-cron");
let nodemailer = require("nodemailer");
const fetch = require("node-fetch");

// query parking status from d.json

const getCurrent = fetch('http://localhost:3000/current')
    .then(response => response.json())

console.log('fetching initial data...');
fetch('http://localhost:3000/test_zones')
    .then(response => response.json())
    .then(zones => {
        console.log('received a response'); 
        for(id in zones) {
            const zone = zones[id];

            cron.schedule(zone.dayBeforeReminder, function () {
                fetch('http://localhost:3000/current')
                .then(response => {
                    return response.json()
                })
                .then(currentZone => {
                    if(currentZone.id === zone.id) {
                        // send email for day before reminder
                        // light up warning lights
                        console.log(zone.desc + ' day before DISPATCH');
                    } else {
                        console.log('cron ' + zone.id + ' day before all good');
                    }
                })
            });
                
           
            cron.schedule(zone.morningOfReminder, function () {
                fetch('http://localhost:3000/current')
                .then(response => {
                    console.log('received current...');
                    return response.json()
                })
                .then(currentZone => {
                    if(currentZone.id === zone.id) {
                        // send email for day before reminder
                        // light up warning lights
                        console.log(zone.desc + ' morning of DISPATCH');
                    } else {
                        console.log('cron ' + zone.id + ' morning of all good');
                    }
                })
            });
        }
    }).catch(err => {
        console.log(err);
    });
console.log('exiting...');


//simulating an change to the state of current parking spot

//change the current position after a while
// setTimeout(() => {
//     fetch('http://localhost:3000/current', {
//         method: 'POST',
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             "id": 1,
//             "desc": "N. Page",
//             "fequency": "Tuesdays at 12pm",
//             "dayBeforeReminder": "*/6 * * * * *", 
//             "morningOfReminder": "*/9 * * * * *"
//         })
//     })
// },11000);




// create mail transporter

// let transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "parking.budddy@gmail.com",
//     pass: "noMOREt1ick3ts"
//   }
// });

// setup cron jobs for configured zones

// for(id in zonesNearHomeTEST) {
//     const zone = zonesNearHomeTEST[id];
//     cron.schedule(zone.dayBeforeReminder, function() {
//         if(getParkingStatus() === zone.id) {
//             // send email for day before reminder
//             // light up warning lights
//         } 
//     });
//     cron.schedule(zone.morningOfReminder, function() {
//         if(getParkingStatus() === zone.id) {
//             // send email for morning of reminder
//             // light up warning lights
//         } 
//     });
// }

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

