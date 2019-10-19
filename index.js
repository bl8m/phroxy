let PhoneManager = require('./lib/PhoneManager.js');
let TellowsConnector = require('./lib/TellowsConnector.js');


let pm = new PhoneManager('/dev/ttyACM0', './phroxy.sqlite');

pm.on('ring', () => { console.log('RING') });
pm.on('call-received', (number) => { console.log('RECEIVED ' + number) });
pm.on('call-rejected', (number) => { console.log('REJECTED ' + number) });
// let tc = new TellowsConnector();

// tc.check('0321465872').then(function(result){
// 	console.log(result);
// });





