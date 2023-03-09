export const generateTimestamps = (step) => {
	const dt = new Date(1970, 0, 1);
	const timestamps = [];
	while (dt.getDate() === 1) {
		timestamps.push(dt.toLocaleTimeString('en-US', {hour12: false}));
		dt.setMinutes(dt.getMinutes() + step);
	}

	return timestamps;
}

function hexToHSL(hex) {
	// Convert hex to RGB first
	let r = 0, g = 0, b = 0;
	if (hex.length === 4) {
		r = parseInt(hex[1] + hex[1], 16);
		g = parseInt(hex[2] + hex[2], 16);
		b = parseInt(hex[3] + hex[3], 16);
	} else if (hex.length === 7) {
		r = parseInt(hex.slice(1, 3), 16);
		g = parseInt(hex.slice(3, 5), 16);
		b = parseInt(hex.slice(5), 16);
	}

	// Then convert RGB to HSL
	r /= 255;
	g /= 255;
	b /= 255;
	let cmin = Math.min(r,g,b),
		cmax = Math.max(r,g,b),
		delta = cmax - cmin,
		h = 0,
		s = 0,
		l = 0;

	if (delta === 0) {
		h = 0;
	} else if (cmax === r) {
		h = ((g - b) / delta) % 6;
	} else if (cmax === g) {
		h = (b - r) / delta + 2;
	} else {
		h = (r - g) / delta + 4;
	}

	h = Math.round(h * 60);

	if (h < 0) {
		h += 360;
	}

	l = (cmax + cmin) / 2;
	s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

	s = +(s * 100).toFixed(1);
	l = +(l * 100).toFixed(1);

	return {h, s, l};
}

function HSLToHex({h,s,l}) {
	s /= 100;
	l /= 100;

	let c = (1 - Math.abs(2 * l - 1)) * s,
		x = c * (1 - Math.abs((h / 60) % 2 - 1)),
		m = l - c/2,
		r = 0,
		g = 0,
		b = 0;

	if (0 <= h && h < 60) {
		r = c; g = x; b = 0;
	} else if (60 <= h && h < 120) {
		r = x; g = c; b = 0;
	} else if (120 <= h && h < 180) {
		r = 0; g = c; b = x;
	} else if (180 <= h && h < 240) {
		r = 0; g = x; b = c;
	} else if (240 <= h && h < 300) {
		r = x; g = 0; b = c;
	} else if (300 <= h && h < 360) {
		r = c; g = 0; b = x;
	}
	// Having obtained RGB, convert channels to hex
	r = Math.round((r + m) * 255).toString(16);
	g = Math.round((g + m) * 255).toString(16);
	b = Math.round((b + m) * 255).toString(16);

	// Prepend 0s, if necessary
	if (r.length === 1) {
		r = "0" + r;
	}

	if (g.length === 1) {
		g = "0" + g;
	}

	if (b.length === 1) {
		b = "0" + b;
	}

	return "#" + r + g + b;
}

export function getColorsDayMode(baseColor, numColors) {
	// Convert the base color to HSL format
	let hslBaseColor = hexToHSL(baseColor);

	// Create an array to hold the colors
	let colors = [];

	// Calculate the step size for increasing saturation
	let saturationStep = hslBaseColor.s / (numColors - 1);

	// Loop through the number of colors requested
	for (let i = 0; i < numColors; i++) {
		// Calculate the saturation for this color
		let luminosity,
			saturation;

		if (i%2) {
			luminosity = hslBaseColor.l - i/2 ? (i/2 - 1) * saturationStep : 0;
			saturation = hslBaseColor.s + (i/2 * saturationStep);
		} else {
			luminosity = hslBaseColor.l - (i/2 * saturationStep);
			saturation = hslBaseColor.s + i/2 ? (i/2 - 1) * saturationStep : 0;
		}

		let hslColor;
		// Create the color in HSL format
		if (saturation <= 100 && luminosity >= 10) {
			hslColor = {h: hslBaseColor.h, s: saturation, l: luminosity};
		} else if (saturation > 100 && luminosity >= 10) {
			hslColor = {h: hslBaseColor.h, s: 100, l: luminosity};
		} else if (saturation <= 100 && luminosity < 10) {
			hslColor = {h: hslBaseColor.h, s: saturation, l: 10};
		} else if (saturation > 100 && luminosity < 10) {
			hslColor = {h: hslBaseColor.h, s: 100, l: 10};
		}

		// Convert the color back to hex format and add it to the array
		let hexColor = HSLToHex(hslColor);
		colors.push(hexColor);
	}

	return colors;
}

export function getColorsNightMode(baseColor, numColors) {
	// Convert the base color to HSL format
	let hslBaseColor = hexToHSL(baseColor);

	// Create an array to hold the colors
	let colors = [];

	// Calculate the step size for increasing saturation
	let saturationStep = hslBaseColor.s / (numColors - 1);

	// Loop through the number of colors requested
	for (let i = 0; i < numColors; i++) {
		// Calculate the saturation for this color
		let luminosity,
			saturation;

		if (i%2) {
			luminosity = hslBaseColor.l + i/2 ? (i/2 - 1) * saturationStep : 0;
			saturation = hslBaseColor.s - (i/2 * saturationStep);
		} else {
			luminosity = hslBaseColor.l + (i/2 * saturationStep);
			saturation = hslBaseColor.s - i/2 ? (i/2 - 1) * saturationStep : 0;
		}

		let hslColor;
		// Create the color in HSL format
		if (saturation >= 25 && luminosity <= 80) {
			hslColor = {h: hslBaseColor.h, s: saturation, l: luminosity};
		} else if (saturation < 25 && luminosity <= 80) {
			hslColor = {h: hslBaseColor.h, s: 25, l: luminosity};
		} else if (saturation >= 25 && luminosity > 80) {
			hslColor = {h: hslBaseColor.h, s: saturation, l: 80};
		} else if (saturation < 25 && luminosity > 80) {
			hslColor = {h: hslBaseColor.h, s: 25, l: 80};
		}

		// Convert the color back to hex format and add it to the array
		let hexColor = HSLToHex(hslColor);
		colors.push(hexColor);
	}

	return colors;
}
