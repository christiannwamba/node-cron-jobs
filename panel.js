var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LED = new Gpio(25, 'out'); //use GPIO pin 4 as output
var btns = [
  { 
    input: new Gpio(21, 'in',  'rising', {debounceTimeout: 10}), 
    output: new Gpio(25, 'out'),
    state: 0 
  }, { 
    input: new Gpio(20, 'in',  'rising', {debounceTimeout: 10}), 
    output: new Gpio(24, 'out'),
    state: 0 
  }, { 
    input: new Gpio(16, 'in',  'rising', {debounceTimeout: 10}), 
    output: new Gpio(23, 'out'),
    state: 0 
  }, { 
    input: new Gpio(12, 'in',  'rising', {debounceTimeout: 10}), 
    output: new Gpio(18, 'out'),
    state: 0 
  }
]


btns.forEach((button, index) => {
  button.input.watch(function (err, value) { //Watch for hardware interrupts on pushButton GPIO, specify callback function
    if (err) { //if an error
      console.error('There was an error', err); //output error message to console
    return;
    }
    var newState = btns[index].state ^ 1;
    button.output.writeSync(newState); //turn LED on or off depending on the button state (0 or 1)
    btns[index].state = newState;
    console.log('btn ' + index + ' pressed, state is now ' + JSON.stringify(btns[index].state));
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