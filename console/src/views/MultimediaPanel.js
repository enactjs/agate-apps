import {Cell, Column, Row} from '@enact/ui/Layout';
import Item from '@enact/agate/Item';
import kind from '@enact/core/kind';
import {Panel} from '@enact/agate/Panels';
import React from 'react';
import openSocket from 'socket.io-client';

// import viewCss from './Settings.less';
// import {getPanelIndexOf} from '../App';
import AppContextConnect from '../App/AppContextConnect';
const socket = openSocket('http://localhost:3000');
// socket.on('server event', event => console.log(event));

const Multimedia = kind({
	name: 'Multimedia',
	styles: {
		// css: viewCss,
		className: 'multimediaView'
	},

	handlers: {
		onVideoSelect: video => () => {
			socket.emit('video', video);
		}
	},

	render: ({css, onVideoSelect, ...rest}) => (
		<Panel {...rest}>
			<Row className="enact-fit" align=" center">
<<<<<<< HEAD
				<Cell size="40%">
					<Item onClick={onVideoSelect({title: 'Pasta day', url: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fjtbcnews%2Fvideos%2F2092788370971685%2F&show_text=0&width=560?autoplay=1'})}>{'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fjtbcnews%2Fvideos%2F2092788370971685%2F&show_text=0&width=560'}</Item>
					<Item onClick={onVideoSelect({title: 'Jssie J - Not my ex', url: 'https://www.youtube.com/embed/FvcNr_5uWgY?autoplay=1'})}>{'https://www.youtube.com/embed/RYdQwLP1gfU'}</Item>
					<Item onClick={onVideoSelect({title: 'lofi music live', url: 'https://www.youtube.com/embed/LsBrT6vbQa8?autoplay=1'})}>{'https://www.youtube.com/embed/LsBrT6vbQa8'}</Item>
=======
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
>>>>>>> ensure unique key for items in lists
				</Cell>
			</Row>
		</Panel>
	)
});

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
