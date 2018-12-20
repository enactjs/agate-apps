import Cell from '@enact/ui/Layout';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

import {WidgetBase, WidgetDecorator} from '../Widget';

import AppStateConnect from '../../App/AppContextConnect';
import {ScreenSelectionPopup} from '../../../../components/ScreenSelectionPopup';
import {MultimediaDecorator, ResponsiveVirtualList} from '../../views/Multimedia';

import css from './CompactMultimedia.less';

const CompactScreenMonitorBase = kind({
	name: 'CompactScreenMonitor',
	propTypes: {
		containerShape: PropTypes.object,
		screenId: PropTypes.number,
		screenImage: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
	},
	styles: {
		css,
		className: 'compactScreenMonitor'
	},
	computed: {
		className: ({containerShape: {size: {relative = 'small'}}, styler}) => {
			return styler.append(relative && css[relative]);
		},
		imgUrl: ({containerShape: {size: {relative = 'small'}}, nowPlaying}) => {
			if (!nowPlaying[1]) return;
			if (relative === 'small') {
				return nowPlaying[1].medium.url;
			}
			return nowPlaying[1].high.url;
		},
		videoUrl: ({nowPlaying}) => {
			if (!nowPlaying[1]) return;
			const parts = nowPlaying[1].default.url.split('/');
			parts.pop();
			const videoId = parts.pop();
			return `https://www.youtube.com/embed/${videoId}`;
		}
	},
	render: ({imgUrl, videoUrl, ...rest}) => {
		delete rest.nowPlaying;

		return (
			<WidgetBase
				{...rest}
				align="flex-start space-between"
				title="Now Playing"
				view="multimedia"
			>
				<video src={videoUrl} poster={imgUrl} />
				<Cell />
			</WidgetBase>
		);
	}
});

const CompactScreenMonitor = AppStateConnect(({appState: {nowPlaying}}) => ({
		nowPlaying
	})
)(WidgetDecorator(CompactScreenMonitorBase));

const CompactMultimediaBase = kind({
	name: 'CompactMultimedia',

	propTypes: {
		screenIds: PropTypes.array.isRequired,
		adContent: PropTypes.any,
		containerShape: PropTypes.object,
		onClosePopup: PropTypes.func,
		onSelectVideo: PropTypes.func,
		onSendVideo: PropTypes.func,
		showAd: PropTypes.bool,
		showPopup: PropTypes.bool,
		videos: PropTypes.array
	},

	styles: {
		css,
		className: 'compactMultimedia'
	},

	computed: {
		className: ({containerShape: {size: {relative = 'small'}}, styler}) => {
			return styler.append(relative && css[relative]);
		}
	},

	render: ({containerShape, onClosePopup, onSelectVideo, onSendVideo, screenIds, showPopup, videos, ...rest}) => {
		delete rest.adContent;
		delete rest.showAd;

		const size = containerShape.size.relative || 'small';

		return (
			<React.Fragment>
				<ScreenSelectionPopup
					onClose={onClosePopup}
					onSelect={onSendVideo}
					open={showPopup}
					screenIds={screenIds}
					showAllScreens={showPopup}
				/>
				<WidgetBase
					{...rest}
					containerShape={containerShape}
					view="multimedia"
					title="Media"
					description="Send videos and music to the rear screen(s)"
				>
					<ResponsiveVirtualList
						dataSize={videos.length}
						onSelectVideo={onSelectVideo}
						size={size}
						videos={videos}
					/>
				</WidgetBase>
			</React.Fragment>
		);
	}
});

const CompactMultimedia = MultimediaDecorator(
	WidgetDecorator(
		CompactMultimediaBase
	)
);

export default CompactMultimedia;
export {
	CompactMultimedia,
	CompactScreenMonitor
};
