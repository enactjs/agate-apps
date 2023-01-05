// import Button from '@enact/agate/Button';
import ImageItem from '@enact/agate/ImageItem';
import kind from '@enact/core/kind';
import {Cell} from '@enact/ui/Layout';

import albumArt from '../../../assets/music-album-art.jpg';
import Widget from '../Widget';

import css from './CompactMusic.module.less';

// const PlaybackControls = kind({
// 	name: 'PlaybackControls',
//
// 	styles: {
// 		css,
// 		className: 'playbackControls'
// 	},
//
// 	render: (props) => {
// 		return (
// 			<Row {...props} align="center center">
// 				<Cell shrink>
// 					<Button size="small" icon="arrowlargeleft" />
// 				</Cell>
// 				<Cell shrink>
// 					<Button size="small" icon="ellipsis" />
// 				</Cell>
// 				<Cell shrink>
// 					<Button size="small" icon="arrowlargeright" />
// 				</Cell>
// 			</Row>
// 		);
// 	}
// });

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
					<ImageItem
						caption="The Title"
						css={css}
						className={css.album}
						selectionOverlayShowing
						src={albumArt}
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
