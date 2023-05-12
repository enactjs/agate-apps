// HOC that receives 2 colors (accent and highlight) and returns 2 different colors
import {useEffect, useMemo, useState} from 'react';

import {generateColorsDayMode, generateColorsNightMode, generateTimestamps, getIndex} from './utils';

// In case of using fake times, use this index to generate new colors
let fakeIndex = 0;
let accentColors = {};
let highlightColors = {};
const timestamps = generateTimestamps(5);

const generateColors = (color) => {
	const dayColorsArray = generateColorsDayMode(color, 72);
	const nightColorsArray = generateColorsNightMode(color, 72);
	const array = [...nightColorsArray.reverse(), ...dayColorsArray, ...dayColorsArray.reverse(), ...nightColorsArray.reverse()];
	const offset = array.splice(0, 12);

	return [...array, ...offset];
};

const useLinearSkinColor = (accentColor, highlightColor, skinVariants, useFakeTime = false) => {
	const [fakeIndexVar, setFakeIndexVar] = useState(fakeIndex); // eslint-disable-line
	const [linearAccentColor, setLinearAccentColor] = useState(accentColor);
	const [linearHighlightColor, setLinearHighlightColor] = useState(highlightColor);
	const [linearSkinVariants, setLinearSkinVariants] = useState(skinVariants);
	const index = getIndex();

	const accentColorsArray = useMemo(() => generateColors(accentColor), [accentColor]);
	timestamps.forEach((element, index) => {	// eslint-disable-line
		accentColors[element] = accentColorsArray[index];
	});

	const highlightColorsArray = useMemo(() => generateColors(highlightColor), [highlightColor]);
	timestamps.forEach((element, index) => {	// eslint-disable-line
		highlightColors[element] = highlightColorsArray[index];
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
	}, [index]);

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

				setLinearAccentColor(accentColorsArray[fakeIndex]);
				setLinearHighlightColor(highlightColorsArray[fakeIndex]);

				if (fakeIndex < 287) {
					fakeIndex++;
					setFakeIndexVar(fakeIndex);
				} else {
					fakeIndex = 0;
					setFakeIndexVar(fakeIndex);
				}
			}
		}, useFakeTime ? 500 : 30 * 1000);

		return () => {
			clearInterval(changeColor);
		};
	}, [accentColorsArray, highlightColorsArray, index, useFakeTime]);

	return [fakeIndex, linearAccentColor, linearHighlightColor, linearSkinVariants];
};

export default useLinearSkinColor;
