import {Cell, Column, Row} from '@enact/ui/Layout';
import {VirtualGridList} from '@enact/ui/VirtualList';
import GridListImageItem from '@enact/ui/GridListImageItem';
import {Panel} from '@enact/agate/Panels';
import ri from '@enact/ui/resolution';
import React from 'react';
import youtubeVideos from './youtubeapi.json';
import VideoThumbnail from '../components/VideoThumbnail';
import css from './Multimedia.less';
// const socket = openSocket('http://localhost:3000');

// eslint-disable-next-line enact/display-name, enact/prop-types
const renderVideoThumnail = ({onVideoClick}) => ({index, key, ...rest}) => (
	<VideoThumbnail
		{...rest}
		key={'video' + key}
		video={youtubeVideos.items[index]}
		onSelect={onVideoClick}
	/>
);



class Multimedia extends React.Component {
    videos = [];
    componentWillMount () {
    	this.videos = youtubeVideos.items;
    }
	onVideoSelect = (video) => () => {
		console.log('here')
		// socket.emit('VIDEO_ADD_CONSOLE', video);
	}

	renderItem = ({index, ...rest}) => {
		return (
			<GridListImageItem
				{...rest}
				caption={this.videos[index].snippet.title}
				className={css.gridListItem}
				source={this.videos[index].snippet.thumbnails.medium.url}
				onClick={this.onVideoSelect(this.videos[index])}
			/>
		);
	}

	render () {
		console.log(css);
		const onVideoSelect = this.onVideoSelect;
		return <Panel>
			<Column>
				<Cell>
					<Row><Cell >Recommended videos</Cell></Row>
					<Row align=" center">
						<Cell shrink>
							<VirtualGridList
								dataSize={this.videos.length}
								itemRenderer={this.renderItem}
								itemSize={{minWidth: ri.scale(320), minHeight: ri.scale(180)}}
								className={css.thumbnails}
								style={{width: '960px'}}
								spacing={ri.scale(67)}
							/>
						</Cell>
					</Row></Cell>
			</Column>
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
