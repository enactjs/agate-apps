import Button from '@enact/agate/Button';
import GridListImageItem from '@enact/ui/GridListImageItem';
import kind from '@enact/core/kind';
import Popup from '@enact/agate/Popup';
import React from 'react';
import ri from '@enact/ui/resolution';
import {VirtualGridList} from '@enact/ui/VirtualList';

import youtubeVideos from '../../data/youtubeapi.json';

const screenIds = [1, 2];

const CompactMultimediaBase = kind({
	name: 'CompactMultimedia',
	computed: {
		buttons: ({onSendVideo}) => {
			return screenIds.map((s, index) => {
				return (<Button key={index} onClick={onSendVideo(s)}>{`Screen ${s}`}</Button>);
			});
		},
		renderItem: ({onSelectVideo, videos}) => ({index, ...rest}) => {
			return (
				<GridListImageItem
					{...rest}
					caption={videos[index].snippet.title}
					source={videos[index].snippet.thumbnails.medium.url}
					onClick={onSelectVideo(videos[index])}
				/>
			);
		}
	},
	render: ({buttons, renderItem, showPopup, onTogglePopup, videos}) => {
		return (
			<React.Fragment>
				<Popup
					open={showPopup}
					closeButton
					onClose={onTogglePopup}
				>
					<title>
						Select Screen
					</title>
					<buttons>
						{buttons}
					</buttons>
				</Popup>
				<VirtualGridList
					dataSize={videos.length}
					itemRenderer={renderItem}
					itemSize={{
						minWidth: ri.scale(320),
						minHeight: ri.scale(180)
					}}
					spacing={ri.scale(66)}
				/>
			</React.Fragment>
		);
	}
});

class CompactMultimedia extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showPopup: this.props.showPopup,
			videos: youtubeVideos.items
		};

		this.selectedVideo = {};
	}

	onSelectVideo = (video) => () => {
		this.selectedVideo = video;
		this.onTogglePopup();
	};

	onSendVideo = (screenId) => () => {
		this.props.onSendVideo({screenId, video: this.selectedVideo});
		this.selectedVideo = {};
		this.onTogglePopup();
	};

	onTogglePopup = () => {
		this.setState(({showPopup}) => ({showPopup: !showPopup}));
	};

	render() {
		const props = {
			...this.props,
			onSelectVideo: this.onSelectVideo,
			onSendVideo: this.onSendVideo,
			onTogglePopup: this.onTogglePopup,
			selectedVideo: this.selectedVideo,
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
