import {Cell, Row, Column} from '@enact/ui/Layout';
import Item from '@enact/agate/Item';
import {Panel} from '@enact/agate/Panels';
import {VirtualGridList} from '@enact/ui/VirtualList';
import GridListImageItem from '@enact/ui/GridListImageItem';
import ri from '@enact/ui/resolution';
import openSocket from 'socket.io-client';
import VideoThumbnail from '../components/VideoThumbnail';
import youtubeVideos from './youtubeapi.json';
import Popup from '@enact/agate/Popup';
import Button from '@enact/agate/Button';

import React from 'react';
import css from './Multimedia.less';

const renderVideoThumnail = ({onVideoClick}) => ({index, key, ...rest}) => (
	<VideoThumbnail
		{...rest}
		key={'video' + key}
		video={youtubeVideos.items[index]}
		onSelect={onVideoClick}
	/>
);

class Multimedia extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			open: false
		};
		this.selectedVideo = {};
		this.videos = youtubeVideos.items;
	}

	componentDidMount () {
		this.socket = openSocket('http://localhost:3000');
	}

	sendVideoData = (video) => {
		this.socket.emit('SEND_DATA', video);
	}

	selectVideo = (video) => () => {
		this.selectedVideo = video;
		this.togglePopup();
	}

	togglePopup = () => {
		this.setState((prevState) => {
			return {
				open: !prevState.open
			};
		});
	}

	setScreen = (screenId) => () => {
		const video = {
			type: 'youtube',
			title: this.selectedVideo.snippet.title,
			url: `https://www.youtube.com/embed/${this.selectedVideo.id}?autoplay=1`,
			screenId: screenId,
			route: `VIDEO_ADD_COPILOT/${screenId}`
		};

		this.sendVideoData(video);
		this.togglePopup();
	}

	renderItem = ({index, ...rest}) => {
		return (
			<GridListImageItem
				{...rest}
				caption={this.videos[index].snippet.title}
				className={css.gridListItem}
				source={this.videos[index].snippet.thumbnails.medium.url}
				onClick={this.selectVideo(this.videos[index])}
			/>
		);
	}


	render () {
		return (
			<Panel>
				<Column align="center">
					<Cell shrink>
						Recommended Videos
					</Cell>
					<Cell align="center">
						<VirtualGridList
							dataSize={this.videos.length}
							itemRenderer={this.renderItem}
							itemSize={{
								minWidth: ri.scale(320),
								minHeight: ri.scale(180)
							}}
							className={css.thumbnails}
							style={{width: '960px'}}
							spacing={ri.scale(67)}
						/>
					</Cell>
				</Column>
				<Popup
					open={this.state.open}
				>
					<title>
						Select Screen
					</title>
					<buttons>
						<Button onClick={this.setScreen(1)}>Screen 1</Button>
						<Button onClick={this.setScreen(2)}>Screen 2</Button>
					</buttons>
				</Popup>
			</Panel>
		);
	}
}

export default Multimedia;
