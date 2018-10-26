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
	}

	componentDidMount () {
		this.socket = openSocket('http://localhost:3000');
		this.videos = youtubeVideos.items;
	}

	videos = []

	onVideoSelect = (video) => () => {
		console.log('here');
		this.socket.emit('SEND_DATA', {...video, route: `VIDEO_ADD_COPILOT/${1}`});
	}

	selectVideo = (video) => () => {
		console.log('h')
		this.selectedVideo = video;
		this.onVideoSelect(video)();
	}

	togglePopup = () => {
		this.setState({
			open: !this.state.open
		});
	}

	setScreen = (screenId) => () => {
		const video = {
			type: 'youtube',
			title: this.selectedVideo.title,
			url: `https://www.youtube.com/embed/${this.selectedVideo.id}?autoplay=1`,
			screenId: screenId
		};

		this.onVideoSelect(video);



		// this.togglePopup();
	}

	render () {
		return <Panel>
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
			</Row>
		</Panel>;
	}
}


export default Multimedia;
