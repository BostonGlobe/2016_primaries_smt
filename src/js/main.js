import globeIframe from 'globe-iframe-resizer';
import { Standardize } from 'election-components';
import stateResultsSmallTable from './state-results-small-table';
import PeriodicJS from 'periodic.js';
import { parse } from 'query-string';

// This fires when the parent of iframe resizes
function onPymParentResize(width) {};
globeIframe(onPymParentResize);

function getURL(opts) {

	const base = {
		local: 'http://localhost:3010/',
		dev: 'http://dev.apps.bostonglobe.com/graphics/2016/02/state-results-small-table/assets/data/'
	};

	const baseUrl = location.hostname === 'localhost' ? base.local : base.dev;

	const { state, party, raceType } = parse(location.search);

	const stateAbbr    = Standardize.collapse.state(state);
	const partyAbbr    = Standardize.collapse.party(party);
	const raceTypeName = Standardize.raceType(raceType, true);

	const fullUrl = `${baseUrl}${stateAbbr}-${partyAbbr}-${raceTypeName}.json`.toLowerCase();
	return fullUrl;
}

// set up polling
const displaySelector = '.updater span';
PeriodicJS({
	duration: 60*1000,
	displaySelector,
	callback: fetchData,
	runImmediately: true
});

// from http://youmightnotneedjquery.com/
function getJSON(url, callback) {

	var request = new XMLHttpRequest();
	request.open('GET', url, true);

	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			// Success!
			var data = JSON.parse(request.responseText);
			callback(data);
		} else {
			// We reached our target server, but it returned an error

		}
	};

	request.onerror = function() {
		// There was a connection error of some sort
	};

	request.send();
}

function fetchData(done) {

	// tell user we are fetching data
	const element = document.querySelector(displaySelector);
	element.innerHTML = 'updating';

	const url = getURL();

	getJSON(url, function(json) {

		// update html components
		document.querySelector('.state-results-small-table').innerHTML = stateResultsSmallTable(json);

		// if we have less than 100% precincts reporting, continue

		// get state-level reporting unit
		const stateRU = json.reportingUnits.filter(x => x.level === 'state')[0];

		if (stateRU.precinctsReportingPct < 100) {
			done();
		} else {
			element.innerHTML = '';
		}

	});

}

