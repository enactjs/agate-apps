import Button from '@enact/agate/Button';
import GridListImageItem from '@enact/agate/GridListImageItem';
import kind from '@enact/core/kind';
import Layout from '@enact/ui/Layout';
import React from 'react';

import Widget from '../Widget';

import css from './CompactMusic.less';

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
				<Button icon="skipbackward" size="tiny" type="sized" />
				<Button icon="play" size="small" type="sized" />
				<Button icon="skipforward" size="tiny" type="sized" />
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

	render: (props) => {
		return (
			<Widget {...props} title="Listen" description="Listen to your favorite tunes" view="radio">
				<GridListImageItem
					caption="The Title"
					className={css.album}
					selectionOverlay={PlaybackControls}
					selectionOverlayShowing
					// source={placeholder}
					subCaption="The Album"
				/>
			</Widget>
		);
	}
});

export default CompactMusicBase;
export {
	CompactMusicBase as CompactMusic,
	CompactMusicBase
};
