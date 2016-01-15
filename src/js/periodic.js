import { timer as d3Timer } from 'd3-timer';

export default function PeriodicJS(opts) {

	const { duration, displaySelector, callback, runImmediately } = opts;
	let timer;

	function displayTimeLeft(time) {

		// find the current displayed time
		let element = document.querySelector(displaySelector);
		const currentDisplayedTime = element.innerHTML;

		// format incoming time
		const formattedTime = Math.ceil(time/1000);

		// don't update dom element with same string
		if (formattedTime.toString() !== currentDisplayedTime) {
			element.innerHTML = 'Update in ' + formattedTime;
		}

	}

	function run() {

		timer = d3Timer((elapsed, time) => {

			// tell user how much time is left
			displayTimeLeft(duration - elapsed);

			// are we done?
			if (elapsed > duration) {
				timer.stop();

				// call user-provided callback, and pass along run,
				// so they can resume the timer, if so desired
				callback(run);
			}

		});

	}

	if (runImmediately) {
		callback(run);
	} else {
		run();
	}

}
