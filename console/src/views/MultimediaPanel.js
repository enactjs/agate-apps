import Button from '@enact/agate/Button';
import {Cell, Column} from '@enact/ui/Layout';
import GridListImageItem from '@enact/ui/GridListImageItem';
import {Panel} from '@enact/agate/Panels';
import Popup from '@enact/agate/Popup';
import React from 'react';
import ri from '@enact/ui/resolution';
import {VirtualGridList} from '@enact/ui/VirtualList';

import API from '../../../components/API';
import youtubeVideos from './youtubeapi.json';

import css from './Multimedia.less';

class Multimedia extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			open: false
		};
		// reference for the API component
		this.API = React.createRef();
		this.selectedVideo = {};
		this.videos = youtubeVideos.items;
	}

	selectVideo = (video) => () => {
		this.selectedVideo = video;
		this.togglePopup();
	};

	togglePopup = () => {
		this.setState((prevState) => {
			return {
				open: !prevState.open
			};
		});
	};

	sendVideo = (screenId) => () => {
		this.API.current.sendVideo({screenId, video: this.selectedVideo});
		this.togglePopup();
	};

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
	};

	render () {
		return (
			<>
				{/* eslint-disable-next-line */}
				<API ref={this.API} />
				<Popup
					open={this.state.open}
					closeButton
					onClose={this.togglePopup}
				>
					<title>
						Select Screen
					</title>
					<buttons>
						<Button onClick={this.sendVideo(1)}>Screen 1</Button>
						<Button onClick={this.sendVideo(2)}>Screen 2</Button>
					</buttons>
				</Popup>
				<Panel>
					<Column align="center">
						<Cell shrink>
							Recommended Videos
						</Cell>
						<Cell
							component={VirtualGridList}
							dataSize={this.videos.length}
							itemRenderer={this.renderItem}
							itemSize={{
								minWidth: ri.scale(320),
								minHeight: ri.scale(180)
							}}
							className={css.thumbnails}
							spacing={ri.scale(67)}
						/>
					</Column>
				</Panel>
			</>
		);
	}
}

export default Multimedia;
