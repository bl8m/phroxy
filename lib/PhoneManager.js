const EventEmitter = require('events').EventEmitter

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const moment = require('moment')

const DBManager = require('./DBManager.js');

class PhoneManager extends EventEmitter {



	constructor(port_name, db_filename){

		super();

		var self = this;
		this.port_name = port_name;
		this.port = new SerialPort('/dev/ttyACM0', { baudRate: 9600 })
		this.parser = new Readline();

		this.port.on('error', function(err) {
		  console.log('Error: ', err.message)
		})
		
		this.port.pipe(this.parser);
		//this.parser.on('data', this.handleData);
		this.parser.on('data', (data) => this.handleData(data));

		this.portWrite('AT+FCLASS=1');
		this.portWrite('AT+VCID=1');

		this.db_filename = db_filename;
		this.db = new DBManager(db_filename);
		this.db.on('db-ready', function(){
			self.emit('db-ready');

			
		})
		
	}


	handleData(data){

		if( data.includes("NMBR") ){
			var tokens = data.split("=");
			var number = tokens[1].trim();
			this.handleNumber(number);
		}
		else if( data.includes("RING") ){
			this.emit('ring');
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
		var self = this;

		this.emit('call-received', number);

		this.db.insertCall(number, '', true);

		this.db.checkNumber(number).then(number => {

			console.log(number);

			if(number.blacklisted)
				self.rejectCall(number.number);
		});

		// if(number == '3401044562'){

		// 	var description = 'test';

		// 	this.db.insertCall(number, description, true);

		// 	this.rejectCall(number);
		// }
	}

	rejectCall(number){

		var self = this;

		this.portWrite('ATA');
		this.t = setTimeout(function(){
			self.portWrite('AT+CHUP');
			self.t = setTimeout(function(){
				self.portWrite('+++');
				self.emit('call-rejected', number);
			}, 2000);

		}, 3000);

		
	}
}

module.exports = PhoneManager;