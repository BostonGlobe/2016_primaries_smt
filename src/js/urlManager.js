const RaceDates = require('./raceDates');

module.exports = function urlManager(opts) {

	const stateAbbr = opts.stateAbbr;
	const partyAbbr = opts.partyAbbr;
	const level     = opts.level;

	// get race for this state-party combination
	const date = RaceDates[`${stateAbbr}-${partyAbbr}`.toLowerCase()];

	// construct the api url
	const baseUrl = '//dev.apps.bostonglobe.com/electionapi/elections/';
	// const baseUrl = '//qaweb.bostonglobe.com/electionapi/elections/';
	// const baseUrl = '//www.bostonglobe.com/electionapi/elections/';
	// const baseUrl = '//devweb.bostonglobe.com/electionapi/elections/';

	const url     = `${baseUrl}${date}?statePostal=${stateAbbr}&party=${partyAbbr}&level=${level}`;

	return url;

};
