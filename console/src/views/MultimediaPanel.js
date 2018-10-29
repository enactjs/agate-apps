import {Cell, Row} from '@enact/ui/Layout';
import Item from '@enact/agate/Item';
import {Panel} from '@enact/agate/Panels';
import React from 'react';
import openSocket from 'socket.io-client';
import youtubeVideos from './youtubeapi.json';
import Popup from '@enact/agate/Popup';
import Button from '@enact/agate/Button';

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
			...this.selectedVideo,
			screenId: screenId,
			route: `VIDEO_ADD_COPILOT/${screenId}`
		};

		this.sendVideoData(video);
		this.togglePopup();
	}

	render () {
		return (
			<Panel>
				<Row className="enact-fit" align=" center">
					<Cell>
						{
							this.videos.map((video, index) => {
								return <Item
									key={index}
									onClick={this.selectVideo({
										type: 'youtube',
										title: video.snippet.title,
										url: `https://www.youtube.com/embed/${video.id}?autoplay=1`
									})}

								>
									<img src={video.snippet.thumbnails.default.url} />
									{video.snippet.title}
								</Item>;
							})
						}
					</Cell>
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
				</Row>
			</Panel>
		);
	}
}

export default Multimedia;
