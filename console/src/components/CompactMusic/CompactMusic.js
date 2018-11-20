import Button from '@enact/agate/Button';
import GridListImageItem from '@enact/agate/GridListImageItem';
import kind from '@enact/core/kind';
import Layout from '@enact/ui/Layout';
import React from 'react';

import css from './CompactMusic.less';

const placeholder =
	'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC' +
	'9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHN0cm9rZT0iIzU1NSIgZmlsbD0iI2FhYSIg' +
	'ZmlsbC1vcGFjaXR5PSIwLjIiIHN0cm9rZS1vcGFjaXR5PSIwLjgiIHN0cm9rZS13aWR0aD0iNiIgLz48L3N2Zz' +
	'4NCg==';

const PlaybackControls = kind({
	name: 'PlaybackControls',

	styles: {
		css,
		className: 'playbackControls'
	},

	render: (props) => {
		return (
			<Layout
				{...props}
				orientation="horizontal"
				align="center center"
			>
				<Button icon="skipbackward" small />
				<Button icon="play" />
				<Button icon="skipforward" small />
			</Layout>
		);
	}
});

const CompactMusicBase = kind({
	name: 'CompactMusic',

	styles: {
		css,
		className: 'compactMusic'
	},

	render: ({...rest}) => {
		return (
			<Layout {...rest} orientation="vertical">
				<GridListImageItem
					caption="The Title"
					className={css.album}
					placeholder={placeholder}
					selectionOverlay={PlaybackControls}
					selectionOverlayShowing
					src={placeholder}
					subCaption="The Album by The Artist"
				/>
			</Layout>
		);
	}
});

export default CompactMusicBase;
export {
	CompactMusicBase as CompactMusic,
	CompactMusicBase
};
