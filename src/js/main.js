import globeIframe from 'globe-iframe-resizer';
import { Standardize } from 'election-utils';
import stateResultsSmallTable from './state-results-small-table';
import PeriodicJS from 'periodic.js';
import { parse } from 'query-string';
import getJSON from 'get-json-lite';
import urlManager from './urlManager';

// This fires when the parent of iframe resizes
function onPymParentResize(width) {};
globeIframe(onPymParentResize);

function getURL() {

	const { state, party, raceType } = parse(location.search);

	const stateAbbr    = Standardize.collapse.state(state);
	const partyAbbr    = Standardize.collapse.party(party);
	const raceTypeName = Standardize.raceType(raceType, true);

	const url = urlManager({ stateAbbr, partyAbbr, level: 'state' });

	return url;
}

// set up polling
const displaySelector = '.updater span';
PeriodicJS({
	duration: 15*1000,
	displaySelector,
	callback: fetchData,
	runImmediately: true
});

function fetchData(done) {

	// tell user we are fetching data
	const element = document.querySelector(displaySelector);
	element.innerHTML = 'updating';

	const url = getURL();

	getJSON(url, function(json) {

		const results = json.races[0];

		document.querySelector('.test-status span').innerHTML = results.test ? 'AP TEST DATA' : '';

		// update html components
		document.querySelector('.state-results-small-table').innerHTML = stateResultsSmallTable(results);

		// if we have less than 100% precincts reporting, continue

		// get state-level reporting unit
		const stateRU = results.reportingUnits.filter(x => x.level === 'state')[0];

		if (stateRU.precinctsReportingPct < 100) {
			done();
		} else {
			element.innerHTML = '';
		}

	});

}

