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

function fetchData(resume) {

	// tell user we are fetching data
	const element = document.querySelector(displaySelector);
	element.innerHTML = 'updating';

	const url = getURL();

	getJSON(url, function(json) {

		const results = json.races[0];

		document.querySelector('.test-wrapper').innerHTML = results.test
			? "<div class='test-status'><span class='beta'></span></div>"
			: '';

		// update html components
		document.querySelector('.state-results-small-table').innerHTML = stateResultsSmallTable(results);

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

