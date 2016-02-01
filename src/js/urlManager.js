const RaceDates = require('./raceDates');

module.exports = function urlManager(opts) {

	const stateAbbr = opts.stateAbbr;
	const partyAbbr = opts.partyAbbr;
	const level     = opts.level;

	// get race for this state-party combination
	const date = RaceDates[`${stateAbbr}-${partyAbbr}`.toLowerCase()];

	// construct the api url
	// const baseUrl = 'http://dev.tomcat.boston.com/electionapi/elections/';
	// const baseUrl = 'http://devweb.bostonglobe.com/electionapi/elections/';
	const baseUrl = 'http://www.bostonglobe.com/electionapi/elections/';
	const url     = `${baseUrl}${date}?statePostal=${stateAbbr}&party=${partyAbbr}&level=${level}`;

	return url;

};
