const EventEmitter = require('events').EventEmitter

const Sequelize = require('sequelize');
const Model = Sequelize.Model;

let TellowsConnector = require('./TellowsConnector.js');

// const Call = require('./models/Call.model.js');

class Call extends Model {};
class Number extends Model {};


class DBManager extends EventEmitter {



	constructor(db_file){
		super();

		this.tc = new  TellowsConnector();

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

		Number.init({
		  // attributes
		  number: {
		    type: Sequelize.STRING,
		    allowNull: false,
		    unique: true
		  },
		  description: {
		    type: Sequelize.STRING
		    // allowNull defaults to true
		  },
		  score: {
		    type: Sequelize.INTEGER
		    // allowNull defaults to true
		  },
		  ratings: {
		    type: Sequelize.INTEGER
		    // allowNull defaults to true
		  },
		  
		  blacklisted: {
		    type: Sequelize.BOOLEAN,
		    default: false
		    // allowNull defaults to true
		  },


		}, {
		  sequelize,
		  modelName: 'number'
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
			
		  	return calls;
		})
	}


	async checkNumber(number){
		return Number.findOne({ where: {number: number} }).then(record => {


			if(record){
				return record;
			}
			else{
				return this.tc.check(number).then(function(result){
					var blacklisted = result.score > 5;
					return Number.create({ number: number, 
												description: '', 
												score: result.score,
												ratings: result.ratings,
												blacklisted: blacklisted
												}).then(record => {
													return record;
												});
				});
			}

		})
	}


}

module.exports = DBManager;