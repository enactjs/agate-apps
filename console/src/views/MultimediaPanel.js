import {Cell, Row} from '@enact/ui/Layout';
import Item from '@enact/agate/Item';
// import {stringify} from 'query-string';
import {Panel} from '@enact/agate/Panels';
import React from 'react';
import openSocket from 'socket.io-client';
import youtubeVideos from './youtubeapi.json';
// import AppContextConnect from '../App/AppContextConnect';
const socket = openSocket('http://localhost:3000');
// socket.on('server event', event => console.log(event));

class Multimedia extends React.Component {
    videos = [];
    componentDidMount () {
		this.videos = youtubeVideos.items;
    }
	onVideoSelect = (video) => () => {
		socket.emit('VIDEO_ADD_CONSOLE', video);
	}

	render () {
		return <Panel>
			<Row className="enact-fit" align=" center">
				<Cell>
					{
						this.videos.map((video, index) => {
							return <Item
								key={index}
								onClick={this.onVideoSelect({
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

// const ConnectedSettings = AppContextConnect(({userId, updateAppState}) => ({
// 	userId: userId,
// 	updateUser: ({value}) => {
// 		updateAppState((state) => {
// 			state.userId = value + 1;
// 		}
// 		);
// 	}
// }))(Multimedia);

export default Multimedia;
