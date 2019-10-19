let PhoneManager = require('./lib/PhoneManager.js');
let TellowsConnector = require('./lib/TellowsConnector.js');

//let pm = new PhoneManager('/dev/ttyACM0');
let tc = new TellowsConnector();

tc.check('0321465872').then(function(result){
	console.log(result);
});




