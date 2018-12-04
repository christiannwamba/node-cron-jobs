var http = require('http'),
	mailer = require('../lib/node-mailer');

http.createServer(function (req, res) {
	
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

	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hello World\n');
}).listen(1337, "127.0.0.1");

console.log('Server running at http://127.0.0.1:1337/');