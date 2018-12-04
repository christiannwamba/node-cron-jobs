var mailer = require("nodemailer");
mailer.sendmail = true;

var Mail = function(options) {
	this.from = options.from;
	this.to = options.to;
	this.subject = options.subject;
	this.body = options.body;
	this.callback = options.callback;

	this.init();
};

Mail.prototype = {
	from: null,
	to: null,
	subject: null,
	body: null,
	callback: null
};

Mail.prototype.init = function() {
	var self = this;
	
	var mail = new mailer.EmailMessage({
		sender: this.from,
		to: this.to
	});

	mail.subject = this.subject;
	mail.body = this.body;

	mail.send(function(error, success) {
		if(error){
			self.callback(error);
			return false;
		}

		self.callback(null, success);
		console.log("Message " + (success ? "sent" : "failed"));
	});
};

exports.version = '0.1.1';
exports.Mail = Mail;