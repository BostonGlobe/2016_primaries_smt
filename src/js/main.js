import globeIframe from 'globe-iframe-resizer';
import { stateResultsSmallTable, Standardize } from 'election-components';
import PeriodicJS from './periodic';

// This fires when the parent of iframe resizes
function onPymParentResize(width) {};
globeIframe(onPymParentResize);

function getURL(opts) {

	const baseUrl = 'http://localhost:3010/';

	const parts = getPathnameParts();

	const stateAbbr = Standardize.collapse.state(parts.state);
	const partyAbbr = Standardize.collapse.party(parts.party);
	const raceType = Standardize.raceType(parts.raceType, true);

	return `${baseUrl}${stateAbbr}-${partyAbbr}-${raceType}.json`;

}

function getPathnameParts() {

	const h1 = document.querySelector('h1');
	const parts = h1.innerHTML.split(' ');
	const raceType = parts.pop();
	const party = parts.pop();
	const state = parts.join(' ');
	return {state, party, raceType};

}

// set up polling
const displaySelector = '.updater span';
PeriodicJS({
	duration: 60*1000,
	displaySelector,
	callback: fetchData,
	runImmediately: true
});

function fetchData(done) {

	// tell user we are fetching data
	const element = document.querySelector(displaySelector);
	element.innerHTML = 'updating';

	const url = getURL();

	// fetch data
	fetch(url)
		.then(response => response.json())
		.then(json => {

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

