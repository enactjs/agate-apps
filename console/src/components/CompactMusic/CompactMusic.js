import MediaPlayer from '@enact/agate/MediaPlayer';
import kind from '@enact/core/kind';
import {Cell} from '@enact/ui/Layout';

import Widget from '../Widget';

import css from './CompactMusic.module.less';

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
			<Widget {...props} align="center center" description="Listen to your favorite tunes" icon="music" title="Listen" view="radio">
				<Cell shrink>
					<MediaPlayer type="tiny">{source}</MediaPlayer>
				</Cell>
			</Widget>
		);
	}
});

export default CompactMusicBase;
export {
	CompactMusicBase
};
