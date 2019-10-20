let PhoneManager = require('./lib/PhoneManager.js');



let pm = new PhoneManager('/dev/ttyACM0', './phroxy.sqlite');

pm.on('ring', () => { console.log('RING') });
pm.on('call-received', (number) => { console.log('RECEIVED ' + number) });
pm.on('call-rejected', (number) => { console.log('REJECTED ' + number) });
// let tc = new TellowsConnector();

// tc.check('0992219535').then(function(result){
// 	console.log(result);
// });



// FAKE
pm.on('db-ready', function(){
	pm.parser.emit('data', 'RING');
	pm.parser.emit('data', 'NMBR=0992219535');
	
})
			




