var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LED = new Gpio(25, 'out'); //use GPIO pin 4 as output
const fetch = require("node-fetch");

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

var activateZone = (zone) => {
  button.output.writeSync(newState); //turn LED on or off depending on the button state (0 or 1)

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



btns.forEach((button, index) => {
  button.input.watch(function (err, value) { //Watch for hardware interrupts on pushButton GPIO, specify callback function
    if (err) { //if an error
      console.error('There was an error', err); //output error message to console
    return;
    }

    activateZone(button.zoneMapping);
    
    // var newState = btns[index].state ^ 1;
    // button.output.writeSync(newState);
    // btns[index].state = newState;
    console.log('btn ' + index + ' pressed, state is now ' + JSON.stringify(btns[index].state) + ', POSTing new current spot...');
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


function unexportOnClose() { //function to run when exiting program
  btns.forEach(button => {
    button.output.writeSync(0); // Turn LED off
    button.output.unexport(); // Unexport LED GPIO to free resources
    button.input.unexport(); // Unexport Button GPIO to free resources
  });
};

process.on('SIGINT', unexportOnClose); //function to run when user closes using ctrl+c