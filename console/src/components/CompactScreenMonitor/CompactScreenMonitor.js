import {Cell} from '@enact/ui/Layout';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';

import {WidgetBase, WidgetDecorator} from '../Widget';
import AppStateConnect from '../../App/AppContextConnect';

import css from './CompactScreenMonitor.module.less';

const CompactScreenMonitorBase = kind({
	name: 'CompactScreenMonitor',
	propTypes: {
		nowPlaying: PropTypes.array.isRequired,
		containerShape: PropTypes.object,
		screenId: PropTypes.number,
		screenImage: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
	},
	defaultProps: {
		screenId: 1
	},
	styles: {
		css,
		className: 'compactScreenMonitor'
	},
	computed: {
		className: ({containerShape: {size: {relative = 'small'}}, styler}) => {
			return styler.append(relative && css[relative]);
		},
		imgUrl: ({containerShape: {size: {relative = 'small'}}, nowPlaying, screenId}) => {
			if (!nowPlaying[screenId]) return;
			if (relative === 'small') {
				return nowPlaying[screenId].medium.url;
			}
			return nowPlaying[screenId].high.url;
		},
		videoUrl: ({nowPlaying, screenId}) => {
			if (!nowPlaying[screenId]) return;
			const parts = nowPlaying[screenId].default.url.split('/');
			parts.pop();
			const videoId = parts.pop();
			return `https://www.youtube.com/embed/${videoId}`;
		}
	},
	render: ({containerShape, imgUrl, videoUrl, ...rest}) => {
		delete rest.nowPlaying;
		delete rest.screenId;
		delete rest.screenImage;

		return (
			<WidgetBase
				{...rest}
				containerShape={containerShape}
				icon="carspeaker"
				title="Now Playing"
				view="multimedia"
			>
				<Cell component="video" src={videoUrl} poster={imgUrl} />
			</WidgetBase>
		);
	}
});

const CompactScreenMonitorDecorator = compose(
	AppStateConnect(({multimedia}) => ({
		nowPlaying: multimedia.nowPlaying
	})),
	WidgetDecorator
);

const CompactScreenMonitor = CompactScreenMonitorDecorator(CompactScreenMonitorBase);

export default CompactScreenMonitor;
export {
	CompactScreenMonitor,
	CompactScreenMonitorBase,
	CompactScreenMonitorDecorator
};
