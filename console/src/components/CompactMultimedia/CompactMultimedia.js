import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

import {WidgetBase, WidgetDecorator} from '../Widget';
import {ScreenSelectionPopup} from '../../../../components/ScreenSelectionPopup';
import {MultimediaDecorator, ResponsiveVirtualList} from '../../views/Multimedia';

import css from './CompactMultimedia.less';

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
					icon="rearscreen"
					title="Media"
					description="Send videos and music to the rear screen(s)"
					view="multimedia"
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
	CompactMultimedia
};
