const EventEmitter = require('events').EventEmitter

const Sequelize = require('sequelize');

const Model = Sequelize.Model;

// const Call = require('./models/Call.model.js');

class Call extends Model {};
class Number extends Model {};


class DBManager extends EventEmitter {



	constructor(db_file){
		super();

		this.db_file = db_file;

		var sequelize = new Sequelize({
		  dialect: 'sqlite',
		  storage: db_file
		});

		

		Call.init({
		  // attributes
		  number: {
		    type: Sequelize.STRING,
		    allowNull: false
		  },
		  description: {
		    type: Sequelize.STRING
		    // allowNull defaults to true
		  },
		  rejected: {
		    type: Sequelize.BOOLEAN,
		    default: false
		    // allowNull defaults to true
		  },


		}, {
		  sequelize,
		  modelName: 'call'
		  // options
		});

		var self = this;

		sequelize.sync().then(function(){
			self.sequelize = sequelize;
			self.emit('db-ready');
		});
		
	
	}

	async insertCall(number, description, rejected){
		console.log('DB insertCall ' + number);
		rejected = rejected?rejected:0;
		return await Call.create({ number: number, description: description, rejected: rejected });

	}

	async getCalls(){
		await Call.findAll().then(calls => {
			//console.log(calls);
		  	return calls;
		})
	}


}

module.exports = DBManager;