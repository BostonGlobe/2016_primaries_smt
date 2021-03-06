import addCommas from 'add-commas';
import { standardize, Candidate, primaries2016Candidates, primaries2016Dates } from 'election-utils';
import slugify from 'underscore.string/slugify';
import orderBy from 'lodash.orderby';

function candidateRow(candidate, index, totalVoteCount, party, NUMBER_TO_PRIORITIZE) {

	const first      = candidate.hasOwnProperty('first') ? candidate.first : '';
	const last       = candidate.hasOwnProperty('last') ? candidate.last : '';
	const voteCount  = candidate.hasOwnProperty('voteCount') ? candidate.voteCount : 0;
	const percent    = totalVoteCount > 0 ? candidate.voteCount/totalVoteCount : 0;
	const displayPct = standardize.percent(percent);

	const winnerTag  = Candidate.isWinner(candidate) ? '<span class="winner">✔</span>' : '';

	const image = primaries2016Candidates.find(c => c.last === last.toLowerCase())
		? `${last.toLowerCase().replace("'", "")}.jpg`
		: 'placeholder.png';

	const fancy = `
	<div class='candidate-row fancy'>
		<div class='photo'><img alt='' src="assets/img/${image}" /></div>
		<div class='two-rows'>
			<div class='name-and-pct'>
				<div class='name'>${winnerTag}<span class='first epsilon'>${first}</span> <span class='last epsilon'>${last}</span></div>
				<div class='pct'><span class='epsilon'>${displayPct}%</span></div>
			</div>
			<div class='bar-and-votes'>
				<div class='bar'><span class='iota wrapper'><span style='width: ${displayPct}%'>&nbsp;</span></span></div>
				<div class='votes'><span class='iota'>${addCommas(voteCount)} votes</span></div>
			</div>
		</div>
	</div>
	`;

	const lite = `
	<div class='candidate-row lite'>
		<div class='name-and-votes-and-pct'>
			<span class='name first eta'>${first}</span> <span class='name last eta'>${last}</span> <span class='votes iota'>${addCommas(voteCount)} votes</span> <span class='pct theta'>${displayPct}%</span>
		</div>
	</div>
	`;

	return index < NUMBER_TO_PRIORITIZE ? fancy : lite;

}

export default function stateResultsSmallTable({results, NUMBER_TO_PRIORITIZE, MAX_NUMBER_TO_DISPLAY}) {
	// get state-level reporting unit
	const stateRU = results.reportingUnits.filter(x => x.level === 'state')[0];

	// filter out not real candidates
	const filtered = stateRU.candidates.filter(c => {
		return primaries2016Candidates.find(c1 => c1.last === c.last.toLowerCase());
	});

	const withSuspended = filtered.map(c1 => {
		const c2 = primaries2016Candidates.find(c3 => c3.last === c1.last.toLowerCase());
		const active = c2.suspendedDate ? 0 : 1;
		c1.active = active;
		return c1;
	});

	withSuspended.sort((a,b) => a.ballotOrder - b.ballotOrder);
	withSuspended.sort((a,b) => b.active - a.active);

	// sort candidates by vote count and ballot order
	const candidates = orderBy(withSuspended, ['voteCount'], ['desc']);

	// get the total vote count
	const totalVoteCount = candidates
		.map(x => x.voteCount)
		.reduce((x, y) => x + y);

	const partyAbbr = results.party;
	const party = standardize.expandParty(partyAbbr);

	const stateAbbr = stateRU.statePostal;
	const state = standardize.expandState(stateAbbr);

	const raceType = standardize.raceType(results.raceType);

	const raceInfo = primaries2016Dates.find(d => {
		const sameState = d.stateAbbr === stateAbbr.toUpperCase();
		const sameParty = d.party.toLowerCase() === party.toLowerCase();
		return sameState && sameParty;
	});

	const note = raceInfo.resultsNote ? `<div class="results-note">Note: ${raceInfo.resultsNote}</div>` : '';

	return `

	<div class='title-and-updater ${party}'>
		<div class='title'><span class='iota'>${state} ${party} ${raceType}</span></div>
	</div>

	<div class='results ${party}'>
		${candidates.slice(0, MAX_NUMBER_TO_DISPLAY).map((x, i) => candidateRow(x, i, totalVoteCount, party, NUMBER_TO_PRIORITIZE)).join('')}
	</div>

	${note}

	<div class='precincts-and-more'>
		<div class='precincts'><span class='iota'>${+stateRU.precinctsReportingPct}% <span class='extra'>precincts</span> reporting</span></div>
	</div>

	`;

}

