let EventEmitter = require('events').EventEmitter;
let axios = require('axios');
let cheerio = require('cheerio');
let moment = require('moment');

class TellowsConnector extends EventEmitter {

	constructor(){
		super();

		this.response_data = '';
		this.tellows_url = 'https://www.tellows.it/num/';

		
		this.result = {
			number: null,
			score: null,
			ratings: null,
			//score_advanced: null,
			ts: null
		};

	}

	setResult(number, score, ratings){

		this.result = {
			number: number,
			score: score,
			ratings: ratings,
			// score_advanced: score_advanced,
			ts: moment().unix()
		};
	}

	resetResult(){
		this.setResult(null,null, null);
	}


	async check(number) {

		this.resetResult();

		var self = this;

		var response = await axios.get(this.tellows_url + number);

		var data = response.data;
        this.response_data = data;

        const $ = cheerio.load(data);

        var score = parseInt($('#tellowsscore .scorevalue').text().trim());
        if(isNaN(score))
        	score = null;

        var ratings = parseInt($('#details a[href=#complaint_list]').text().trim());
        if(isNaN(ratings))
        	ratings = null;

        this.setResult(number, score, ratings);

        return this.result;
    }
}

module.exports = TellowsConnector;