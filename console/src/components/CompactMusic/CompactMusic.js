import GridListImageItem from '@enact/agate/GridListImageItem';
import kind from '@enact/core/kind';
import {Row, Cell} from '@enact/ui/Layout';
import Button from '@enact/agate/Button';

import Widget from '../Widget';
import albumArt from '../../../assets/music-album-art.jpg';

import css from './CompactMusic.module.less';

const PlaybackControls = kind({
	name: 'PlaybackControls',

	styles: {
		css,
		className: 'playbackControls'
	},

	render: (props) => {
		return (
			<Row {...props} align="center center">
				<Cell shrink>
					<Button size="small" icon="arrowlargeleft" />
				</Cell>
				<Cell shrink>
					<Button size="small" icon="ellipsis" />
				</Cell>
				<Cell shrink>
					<Button size="small" icon="arrowlargeright" />
				</Cell>
			</Row>
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
			<Widget {...props} icon="music" title="Listen" description="Listen to your favorite tunes" view="radio" align="center center">
				<Cell shrink>
					<GridListImageItem
						caption="The Title"
						css={css}
						className={css.album}
						selectionOverlay={PlaybackControls}
						selectionOverlayShowing
						source={albumArt}
						subCaption="The Album"
					/>
				</Cell>
			</Widget>
		);
	}
});

export default CompactMusicBase;
export {
	CompactMusicBase as CompactMusic,
	CompactMusicBase
};
