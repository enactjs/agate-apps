// import Button from '@enact/agate/Button';
import MediaPlayer from '@enact/agate/MediaPlayer';
import kind from '@enact/core/kind';
import {Cell} from '@enact/ui/Layout';

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
		const audioFiles = [
			'https://sampleswap.org/mp3/artist/254731/BossPlayer_Your-Right-Here-160.mp3',
			'https://sampleswap.org/mp3/artist/78152/HiatusManJBanner_Show-Stopper-160.mp3',
			'https://sampleswap.org/mp3/artist/47067/DJ-Masque_Oceanic-Dawn-160.mp3',
			'https://sampleswap.org/mp3/artist/26546/benzoul_lovevoodoo-160.mp3',
			'https://sampleswap.org/mp3/artist/19139/MarkNine_In-my-Place-160.mp3',
			'https://sampleswap.org/mp3/artist/47067/DJ-Masque_Dont-Forget-To-Be-Yourself-160.mp3'
		];

		const source = audioFiles.map((audioFile, index) => (<source key={index} src={audioFile} type="audio/mp3" />));

		return (
			<Widget {...props} icon="music" title="Listen" description="Listen to your favorite tunes" view="radio" align="center center">
				<Cell shrink>
					<MediaPlayer type="tiny">{source}</MediaPlayer>
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
