import GridListImageItem from '@enact/agate/GridListImageItem';
import kind from '@enact/core/kind';
import Layout, {Column, Cell} from '@enact/ui/Layout';
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
				<Cell shrink><IconButton icon="skipbackward" size="smallest" /></Cell>
				<Cell shrink><IconButton icon="play" size="small" /></Cell>
				<Cell shrink><IconButton icon="skipforward" size="smallest" /></Cell>
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
				<Column align="center center">
					<Cell shrink>
						<GridListImageItem
							caption="The Title"
							className={css.album}
							selectionOverlay={PlaybackControls}
							selectionOverlayShowing
							subCaption="The Album"
						/>
					</Cell>
				</Column>
			</Widget>
		);
	}
});

export default CompactMusicBase;
export {
	CompactMusicBase as CompactMusic,
	CompactMusicBase
};
