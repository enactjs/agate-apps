import Button from '@enact/agate/Button';
import kind from '@enact/core/kind';
import Popup from '@enact/agate/Popup';
import React from 'react';

import CustomLayout from '../CustomLayout';
import {ResponsiveVirtualList} from '../../views/Multimedia';

import youtubeVideos from '../../data/youtubeapi.json';

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

class CompactMultimedia extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			showPopup: this.props.showPopup,
			videos: youtubeVideos.items
		};

		this.selectedVideo = {};
	}

	onBroadcastVideo = () => {
		const video = this.selectedVideo; // onSendVideo will reset this.selectedVideo
		screenIds.forEach((s) => {
			this.selectedVideo = video;
			this.onSendVideo(s)();
		});
	};

	onClosePopup = () => {
		this.setState({showPopup: false});
	};

	onOpenPopup = () => {
		this.setState({showPopup: true});
	};

	onSelectVideo = (video) => () => {
		this.selectedVideo = video;
		this.onOpenPopup();
	};

	onSendVideo = (screenId) => () => {
		this.props.onSendVideo({screenId, video: this.selectedVideo});
		this.selectedVideo = {};
		this.onClosePopup();
	};

	render () {
		const props = {
			...this.props,
			onBroadcastVideo: this.onBroadcastVideo,
			onClosePopup: this.onClosePopup,
			onSelectVideo: this.onSelectVideo,
			onSendVideo: this.onSendVideo,
			showPopup: this.state.showPopup,
			videos: this.state.videos
		};

		return (
			<CompactMultimediaBase {...props} />
		);
	}
}

export default CompactMultimedia;
export {CompactMultimedia};
