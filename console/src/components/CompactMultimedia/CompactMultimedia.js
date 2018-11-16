import Button from '@enact/agate/Button';
import kind from '@enact/core/kind';
import Popup from '@enact/agate/Popup';
import React from 'react';

import CustomLayout from '../CustomLayout';
import {MultimediaDecorator, ResponsiveVirtualList} from '../../views/Multimedia';

const screenIds = [1, 2];

const CompactMultimediaBase = kind({
	name: 'CompactMultimedia',

	computed: {
		buttons: ({onBroadcastVideo, onSendVideo}) => {
			const screens = screenIds.map((s, index) => {
				return (<Button key={index} onClick={onSendVideo(s)}>Screen {s}</Button>);
			});
			screens.push(<Button key={screens.length} onClick={onBroadcastVideo}>All Screens</Button>);
			return screens;
		}
	},

	render: ({buttons, showPopup, onClosePopup, onSelectVideo, videos, ...rest}) => {
		delete rest.onBroadcastVideo;
		delete rest.onSendVideo;
		return (
			<React.Fragment>
				<Popup
					open={showPopup}
					closeButton
					onClose={onClosePopup}
				>
					<title>
						Select Screen
					</title>
					<buttons>
						{buttons}
					</buttons>
				</Popup>
				<CustomLayout>
					<ResponsiveVirtualList
						dataSize={videos.length}
						onSelectVideo={onSelectVideo}
						videos={videos}
					/>
				</CustomLayout>
			</React.Fragment>
		);
	}
});

const CompactMultimedia = MultimediaDecorator(CompactMultimediaBase);

export default CompactMultimedia;
export {CompactMultimedia};
