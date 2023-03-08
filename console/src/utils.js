export function generateRandomColor() {
	return "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
}

export const generateTimestamps = (step) => {
	const dt = new Date(1970, 0, 1);
	const timestamps = [];
	while (dt.getDate() === 1) {
		timestamps.push(dt.toLocaleTimeString('en-US', {hour12: false}));
		dt.setMinutes(dt.getMinutes() + step);
	}

	return timestamps;
}
