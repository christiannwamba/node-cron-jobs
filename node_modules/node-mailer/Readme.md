
# Node-mailer
      
  Mailer on top of nodemailer (https://github.com/andris9/Nodemailer).

  See server.js in examples/

## Installation

    npm install node-mailer

## Quick Start

    var mailer = require('node-mailer');
    
	new mailer.Mail({
		from: 'noreply@domain.com',
		to: 'rodolphe@domain.com',
		subject: 'My Subject',
		body: 'My body',
		callback: function(err, data){
			console.log(err);
			console.log(data);
		}
	});
