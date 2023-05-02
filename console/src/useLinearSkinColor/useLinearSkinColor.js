// HOC that receives 2 colors (accent and highlight) and returns 2 different colors
import {useCallback, useEffect, useState} from 'react';

import {generateColorsDayMode, generateColorsNightMode, generateTimestamps, getIndex} from './utils';

// In case of using fake times, use this index to generate new colors
let fakeIndex = 0;
let accentColors = {};
let highlightColors = {};
const index = getIndex();

const useLinearSkinColor = (accentColor, highlightColor, skinVariants, useFakeTime = false) => {
	const [linearAccentColor, setLinearAccentColor] = useState(accentColor);
	const [linearHighlightColor, setLinearHighlightColor] = useState(highlightColor);
	const [linearSkinVariants, setLinearSkinVariants] = useState(skinVariants);

	const timestamps = generateTimestamps(5);

	const accentColorsArray = useCallback(() => {
		const dayColorsArray = generateColorsDayMode(accentColor, 72);
		const nightColorsArray = generateColorsNightMode(accentColor, 72);
		const array = [...nightColorsArray.reverse(), ...dayColorsArray, ...dayColorsArray.reverse(), ...nightColorsArray.reverse()];
		const offset = array.splice(0, 12);

		return [...array, ...offset];
	}, [accentColor]);

	const highlightColorsArray = useCallback(() => {
		const dayColorsArray = generateColorsDayMode(highlightColor, 72);
		const nightColorsArray = generateColorsNightMode(highlightColor, 72);
		const array = [...dayColorsArray.reverse(), ...nightColorsArray, ...nightColorsArray.reverse(), ...dayColorsArray.reverse()];
		const offset = array.splice(0, 12);

		return [...array, ...offset];
	}, [highlightColor]);

	timestamps.forEach((element, index) => {	// eslint-disable-line
		accentColors[element] = accentColorsArray()[index];
	});

	timestamps.forEach((element, index) => {	// eslint-disable-line
		highlightColors[element] = highlightColorsArray()[index];
	});

	useEffect(() => {
		setLinearAccentColor(accentColor);
	}, [accentColor]);

	useEffect(() => {
		setLinearHighlightColor(highlightColor);
	}, [highlightColor]);

	useEffect(() => {
		setLinearAccentColor(accentColors[index]);
		setLinearHighlightColor(highlightColors[index]);
	}, []);

	useEffect(() => {
		if (!useFakeTime) {
			let skinVariant;
			if (index >= '06:00' && index < '18:00') {
				skinVariant = '';
				setLinearSkinVariants(skinVariant);
			} else {
				skinVariant = 'night';
				setLinearSkinVariants(skinVariant);
			}
		}
	}, [useFakeTime]);

	useEffect(() => {
		let changeColor = setInterval(() => {
			if (!useFakeTime) {
				let skinVariant;
				if (index >= '06:00' && index < '18:00') {
					skinVariant = '';
					setLinearSkinVariants(skinVariant);
				} else {
					skinVariant = 'night';
					setLinearSkinVariants(skinVariant);
				}

				setLinearAccentColor(accentColors[index]);
				setLinearHighlightColor(highlightColors[index]);
			} else {
				let skinVariant;
				if (60 <= fakeIndex && fakeIndex <= 203) {
					skinVariant = '';
					setLinearSkinVariants(skinVariant);
				} else {
					skinVariant = 'night';
					setLinearSkinVariants(skinVariant);
				}

				setLinearAccentColor(accentColorsArray()[fakeIndex]);
				setLinearHighlightColor(highlightColorsArray()[fakeIndex]);

				if (fakeIndex < 287) {
					fakeIndex++;
				} else {
					fakeIndex = 0;
				}
			}
		}, useFakeTime ? 500 : 30 * 1000);

		return () => {
			clearInterval(changeColor);
		};
	}, [accentColorsArray, highlightColorsArray, useFakeTime]);

	return [fakeIndex, linearAccentColor, linearHighlightColor, linearSkinVariants];
};

export default useLinearSkinColor;
