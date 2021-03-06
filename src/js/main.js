import globeIframe from 'globe-iframe-resizer';
import { standardize, primaries2016Candidates } from 'election-utils';
import stateResultsSmallTable from './state-results-small-table';
import PeriodicJS from 'periodic.js';
import { parse } from 'query-string';
import getJSON from 'get-json-lite';
import urlManager from './urlManager';

// This fires when the parent of iframe resizes
function onPymParentResize(width) {};
globeIframe(onPymParentResize);

function getQueryParams() {
	return parse(location.search);
}

function getURL({state, party, raceType}) {

	const stateAbbr    = standardize.collapseState(state);
	const partyAbbr    = standardize.collapseParty(party);
	const raceTypeName = standardize.raceType(raceType, true);

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

function fetchData(resume) {

	// tell user we are fetching data
	const element = document.querySelector(displaySelector);
	element.innerHTML = 'updating';

	const { state, party, raceType } = getQueryParams();
	const url = getURL({state, party, raceType});

	const numGOP = primaries2016Candidates.reduce((count, item) => {
		count += item.suspendedDate ? 0 : 1;
		return count;
	}, 0);

	
	const NUMBER_TO_PRIORITIZE = party.toLowerCase() === 'democratic' ? 2 : 3;
	const MAX_NUMBER_TO_DISPLAY = party.toLowerCase() === 'democratic' ? 2 : Math.min(5, numGOP);

	getJSON(url, function(json) {

		const results = json.races[0];

		document.querySelector('.test-wrapper').innerHTML = results.test
			? "<div class='test-status'><span class='beta'>AP TEST DATA</span></div>"
			: '';

		// update html components
		document.querySelector('.state-results-small-table').innerHTML = stateResultsSmallTable({results, NUMBER_TO_PRIORITIZE, MAX_NUMBER_TO_DISPLAY});

		// get state-level reporting unit
		const stateRU = results.reportingUnits.filter(x => x.level === 'state')[0];

		// if we have less than 100% precincts reporting, continue
		if (+stateRU.precinctsReportingPct < 100) {

			// continue clock
			resume();

		}
		// else clear the updater and don't call periodicjs again
		else {

			element.innerHTML = '';
		}

	}, function(error) {

		// continue clock
		resume();

	});

}

