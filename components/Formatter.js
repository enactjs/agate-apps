const zeroPad = (val) => (val < 10 ? '0' + val : val);

const formatTime = (time) => {
	const formattedEta = new Date(time);
	const hour = formattedEta.getHours() % 12 || 12,
		min = zeroPad(formattedEta.getMinutes()),
		// sec = zeroPad(formattedEta.getSeconds()),
		ampm = (formattedEta.getHours() >= 13 ? 'PM' : 'AM');
	return `${hour}:${min} ${ampm}`;
};

// This array corrosponds with the names in the switch statement below
const durationIncrements = ['day', 'hour', 'min', 'sec'];
const formatDuration = (duration, units = durationIncrements) => {
	duration = Math.ceil(duration);

	const durValues = units.map(unit => {
		switch (unit) {
			case 'day': return Math.floor(duration / (60 * 60 * 24));  // lol we can stop at days;
			case 'hour': return Math.floor(duration / (60 * 60)) % 24;
			case 'min': return Math.floor(duration / 60) % 60;
			case 'sec': return Math.floor(duration) % 60;
		}
	});

	// It's only useful to show the two largest increments
	const durParts = [];
	for (let i = 0, useful = 0; i < durValues.length && useful < 2; i++) {
		if (durValues[i] || useful) {
			useful++;
		}
		// `zero` values are not displayed, but still counted as useful
		if (durValues[i]) {
			// stack up the number, unit, and pluralize the unit
			durParts[i] = durValues[i] + ' ' + units[i] + (durValues[i] === 1 ? '' : 's');
		}
	}
	// Prune the empty ones and join the rest.
	return durParts.filter(part => !!part).join(' ');
};

export {
	formatTime,
	formatDuration
};
