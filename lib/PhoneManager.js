const EventEmitter = require('events').EventEmitter

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const moment = require('moment')

class PhoneManager extends EventEmitter {



	constructor(port_name){
		super();

		this.port_name = port_name;
		this.port = new SerialPort('/dev/ttyACM0', { baudRate: 9600 })
		this.parser = new Readline();
		
		this.port.on('error', function(err) {
		  console.log('Error: ', err.message)
		})
		
		this.port.pipe(this.parser);
		this.parser.on('data', this.handleData);

		this.portWrite('AT+FCLASS=1');
		this.portWrite('AT+VCID=1');

	}


	handleData(data){

		var self = this;

		if( data.includes("NMBR") ){
			var tokens = data.split("=");
			var number = tokens[1].trim();
			self.handleNumber(number);
		}
		else if( data.includes("RING") ){
			console.log('RINGING ');
		}
	}


	portWrite(data){
		console.log('WRITING ' + data);
		this.port.write(data + "\r", function(err, results) {
			if(err != undefined)
		    	console.log("err: " + err);

		    if(results != undefined)
		    	console.log("results: " + results);

		  }); 
		this.port.drain();
	}

	handleNumber(number){

		console.log('RECEIVING CALL FROM ' + number);

		if(number == '3401044562'){
			this.refuseCall(number);
		}
	}

	refuseCall(number){
		console.log('REFUSING ' + number);

		var self = this;

		this.portWrite('ATA');
		this.t = setTimeout(function(){
			self.portWrite('AT+CHUP');
			self.t = setTimeout(function(){
				self.portWrite('+++');
			}, 2000);

		}, 3000);

		
	}
}

module.exports = PhoneManager;