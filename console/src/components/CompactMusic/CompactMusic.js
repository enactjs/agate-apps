import GridListImageItem from '@enact/agate/GridListImageItem';
import kind from '@enact/core/kind';
import Layout, {Column, Cell} from '@enact/ui/Layout';
import IconButton from '@enact/agate/IconButton';
import React from 'react';

import Widget from '../Widget';
import albumArt from '../../../assets/music-album-art.jpg';

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
				<Cell shrink><IconButton size="smallest">skipbackward</IconButton></Cell>
				<Cell shrink><IconButton size="small">play</IconButton></Cell>
				<Cell shrink><IconButton size="smallest">skipforward</IconButton></Cell>
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
							source={albumArt}
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
