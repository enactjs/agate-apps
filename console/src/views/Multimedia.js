import React from 'react';
import classnames from 'classnames';
import GridListImageItem from '@enact/ui/GridListImageItem';
import {Cell, Column} from '@enact/ui/Layout';
import ri from '@enact/ui/resolution';
import {VirtualGridList} from '@enact/ui/VirtualList';
import Button from '@enact/agate/Button';
import {Panel} from '@enact/agate/Panels';
import Divider from '@enact/agate/Divider';
import Popup from '@enact/agate/Popup';

import Communicator from '../../../components/Communicator';
import youtubeVideos from '../data/youtubeapi.json';

import css from './Multimedia.less';

class Multimedia extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			open: false
		};
		// reference for the Communicator component
		this.comm = React.createRef();
		this.selectedVideo = {};
		this.videos = youtubeVideos.items;
	}

	selectVideo = (video) => () => {
		this.selectedVideo = video;
		this.togglePopup();
	};

	togglePopup = () => {
		this.setState(({open}) => ({open: !open}));
	};

	sendVideo = (screenId) => () => {
		this.comm.current.sendVideo({screenId, video: this.selectedVideo});
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
		const {className, ...rest} = this.props;
		return (
			<React.Fragment>
				<Communicator ref={this.comm} />
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
				<Panel {...rest} className={classnames(className, css.multimedia)}>
					<Column align="center">
						<Cell shrink>
							<Divider>Recommended Videos</Divider>
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
							spacing={ri.scale(66)}
						/>
					</Column>
				</Panel>
			</React.Fragment>
		);
	}
}

export default Multimedia;
