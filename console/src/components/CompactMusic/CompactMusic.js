import GridListImageItem from '@enact/agate/GridListImageItem';
import kind from '@enact/core/kind';
import Layout from '@enact/ui/Layout';
import React from 'react';

import IconButton from '../IconButton';
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
				<IconButton icon="skipbackward" size="smallest" />
				<IconButton icon="play" size="small" />
				<IconButton icon="skipforward" size="smallest" />
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
			<Widget {...props} view="radio" header="Listen">
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
