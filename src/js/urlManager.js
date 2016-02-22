import { primaries2016Dates, standardize} from 'election-utils';

export default function urlManager(opts) {

	const stateAbbr = opts.stateAbbr;
	const partyAbbr = opts.partyAbbr;
	const level     = opts.level;
	const test		= true;

	// get race for this state-party combination
	const { date } = primaries2016Dates.find(el => el.stateAbbr.toLowerCase() === stateAbbr.toLowerCase() && el.party === standardize.expandParty(partyAbbr));

	// construct the api url
	const baseUrl = test ? '//dev.apps.bostonglobe.com/electionapi/elections/' : '//www.bostonglobe.com/electionapi/elections/';

	const url = `${baseUrl}${date}?statePostal=${stateAbbr}&party=${partyAbbr}&level=${level}`;

	return url;

	// const baseUrl = '//qaweb.bostonglobe.com/electionapi/elections/';
	// const baseUrl = '//devweb.bostonglobe.com/electionapi/elections/';

	// const baseUrl = '//api.ap.org/v2/elections/';
	// const url = `${baseUrl}${date}?statepostal=${stateAbbr}&party=${partyAbbr}&level=${level}&test=true&apikey=2F2XwShRRLTIV1MgLIVZMDgbeWtbZqUX&officeID=P&format=json`;

};
