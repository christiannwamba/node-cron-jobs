const cron = require("node-cron");
let nodemailer = require("nodemailer");
const fetch = require("node-fetch");
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO

// setup warning lights
var warningLED = new Gpio(5, 'out');
var isFlashing = true;

function blinkLED() {
    if (warningLED.readSync() === 0 && isFlashing) { //check the pin state, if the state is 0 (or off)
        warningLED.writeSync(1); //set pin state to 1 (turn LED on)
    } else {
        warningLED.writeSync(0 && isFlashing); //set pin state to 0 (turn LED off)
    }
}
setInterval(blinkLED, 100); //run the blinkLED function every 250ms

const triggerWarning = () => {
    isFlashing = true;
    setTimeout(() => { //function to stop blinking
        isFlashing = false
    }, 2000); //stop blinking after 5 seconds 
}   


var btns = [
    { 
      input: new Gpio(21, 'in',  'rising', {debounceTimeout: 10}), 
      output: new Gpio(25, 'out'),
      zoneMapping: 1,
      state: 0 
    }, { 
      input: new Gpio(20, 'in',  'rising', {debounceTimeout: 10}), 
      output: new Gpio(24, 'out'),
      zoneMapping: 2,
      state: 0 
    }, { 
      input: new Gpio(16, 'in',  'rising', {debounceTimeout: 10}), 
      output: new Gpio(23, 'out'),
      zoneMapping: 3,
      state: 0 
    }, { 
      input: new Gpio(12, 'in',  'rising', {debounceTimeout: 10}), 
      output: new Gpio(18, 'out'),
      zoneMapping: 4,
      state: 0 
    }
  ];


console.log('fetching initial data...');
// Get all possible zones
fetch('http://localhost:3000/test_zones')
    .then(response => response.json())
    .then(zones => {
        console.log('received a response'); 
        for(id in zones) {
            const zone = zones[id];

            // setup cron for first reminder
            cron.schedule(zone.dayBeforeReminder, function () {
                fetch('http://localhost:3000/current')
                .then(response => {
                    return response.json()
                })
                .then(currentZone => {
                    if(currentZone.id === zone.id) {
                        // send email for day before reminder  
                        triggerWarning();  
                        console.log(zone.desc + ' day before DISPATCH');
                    } else {
                        console.log('cron ' + zone.id + ' day before all good');
                    }
                })
            });
                
            // setup cron for last reminder
            cron.schedule(zone.morningOfReminder, function () {
                fetch('http://localhost:3000/current')
                .then(response => {
                    console.log('received current...');
                    return response.json()
                })
                .then(currentZone => {
                    if(currentZone.id === zone.id) {
                        // send email for day before reminder
                        triggerWarning();
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




// to handle button presses
var activateZone = (zone, index) => {
    btns.forEach((button, index) => {
        if(button.zoneMapping == zone) {
        btns[index].state = true;
        btns[index].output.writeSync(1);
        } else {
        btns[index].state = false;
        btns[index].output.writeSync(0);
        }
    });
    };

// setup buttons
btns.forEach((button, index) => {
    button.input.watch(function (err, value) { //Watch for hardware interrupts on pushButton GPIO, specify callback function
      if (err) { //if an error
        console.error('There was an error', err); //output error message to console
      return;
      }
  
      activateZone(button.zoneMapping);
            fetch('http://localhost:3000/current', {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              "id": button.zoneMapping
          })
      })
    });
  });

//setup state LED from first load
fetch('http://localhost:3000/current')
    .then(response => {
        return response.json()
    })
    .then(currentZone => {
        const current =  btns.find(button => (button.zoneMapping === currentZone));
        current.output.writeSync(1);
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

