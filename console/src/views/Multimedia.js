import {Cell, Row} from '@enact/ui/Layout';
import Divider from '@enact/agate/Divider';
import {Draggable, ResponsiveBox} from '@enact/agate/DropManager';
import GridListImageItem from '@enact/ui/GridListImageItem';
import hoc from '@enact/core/hoc';
import Job from '@enact/core/util/Job';
import kind from '@enact/core/kind';
import {Panel} from '@enact/agate/Panels';
import PropTypes from 'prop-types';
import React from 'react';
import ri from '@enact/ui/resolution';
import ThumbnailItem from '@enact/agate/ThumbnailItem';
import {VirtualGridList, VirtualList} from '@enact/ui/VirtualList';

import appConfig from '../../config';
import Communicator from '../../../components/Communicator';
import CustomLayout from '../components/CustomLayout';
import ScreenSelectionPopup from '../components/ScreenSelectionPopup';

import youtubeVideos from '../data/youtubeapi.json';

import css from './Multimedia.less';

const screenIds = [0, 1, 2];

const DraggableDiv = Draggable('div');

const IFrame = kind({
	name: 'IFrame',
	render: (props) => {
		return (
			<Cell
				{...props}
				component="iframe"
			/>
		);
	}
});

const ResponsiveVirtualList = ResponsiveBox(kind({
	name: 'ResponsiveVirtualList',
	propTypes: {
		direction: PropTypes.string,
		onSelectVideo: PropTypes.func
	},
	defaultProps: {
		direction: 'vertical'
	},
	computed: {
		itemRenderer: ({containerShape, onSelectVideo, videos}) => ({index, ...rest}) => {
			const {size: {relative}} = containerShape;
			switch (relative) {
				case 'large': {
					return (
						<GridListImageItem
							{...rest}
							caption={videos[index].snippet.title}
							className={css.gridListItem}
							source={videos[index].snippet.thumbnails.medium.url}
							onClick={onSelectVideo(videos[index])}
						/>
					);
				}
				default: {
					return (
						<ThumbnailItem
							{...rest}
							css={css}
							onClick={onSelectVideo(videos[index])}
							src={videos[index].snippet.thumbnails.medium.url}
						>
							{videos[index].snippet.title}
						</ThumbnailItem>
					);
				}
			}
		}
	},
	render: ({containerShape, direction, style = {}, ...rest}) => {
		const {size: {relative}} = containerShape;
		let List, spacing, itemSize;

		switch (relative) {
			case 'large': {
				List = VirtualGridList;
				spacing = ri.scale(66);
				itemSize = {
					minWidth: ri.scale(320),
					minHeight: ri.scale(180)
				};
				break;
			}
			default: {
				List = VirtualList;
				spacing = ri.scale(15);
				itemSize = ri.scale(90);
			}
		}

		delete rest.onSelectVideo;
		return (
			<List
				{...rest}
				direction={direction}
				style={style}
				spacing={spacing}
				itemSize={itemSize}
			/>
		);
	}
}));

const MultimediaBase = kind({
	name: 'Multimedia',

	styles: {
		css,
		className: 'multimedia'
	},

	render: ({
		adContent,
		arrangeable,
		arrangement,
		buttons,
		showAd,
		showPopup,
		onArrange,
		onClosePopup,
		onSelectVideo,
		onSendVideo,
		url,
		videos,
		...rest
	}) => {
		return (
			<React.Fragment>
				<ScreenSelectionPopup
					screenIds={screenIds}
					open={showPopup}
					onSelect={onSendVideo}
				/>
				<Panel {...rest}>
					<CustomLayout
						arrangeable={arrangeable}
						arrangement={arrangement}
						onArrange={onArrange}
					>
						<left>
							<DraggableDiv containerShape={{size: {relative: 'large'}}}>
								<Divider className={css.divider}>Recommended Videos</Divider>
								<ResponsiveVirtualList
									dataSize={videos.length}
									onSelectVideo={onSelectVideo}
									videos={videos}
								/>
							</DraggableDiv>
						</left>
						<Row className={css.bodyRow}>
							<IFrame allow="autoplay" className={css.iframe} src={url} />
							{!showAd ? null : <Cell className={css.adSpace} shrink>
								{adContent}
							</Cell>}
						</Row>
					</CustomLayout>
				</Panel>
			</React.Fragment>
		);
	}
});

const defaultConfig = {
	videos: youtubeVideos.items
};

const MultimediaDecorator = hoc(defaultConfig, (configHoc, Wrapped) => {
	return class extends React.Component {
		static displayName = 'MultimediaDecorator';

		constructor (props) {
			super(props);

			this.state = {
				adContent: this.props.adContent || 'Your Ad Here',
				screenId: 0,
				showAd: this.props.showAd || false,
				url: '',
				videos: configHoc.videos
			};
			this.selectedVideo = {};

			// Job to control hiding ads
			this.adTimer = new Job(this.onHideAdSpace);
		}

		onClosePopup = () => {
			this.setState({showPopup: false});
		};

		onHideAdSpace = () => {
			this.setState({adContent: '', showAd: false});
		};

		onOpenPopup = () => {
			this.setState({showPopup: true});
		};

		onPlayVideo = ({url}) => {
			this.setState({url});
		};

		onSelectVideo = (video) => () => {
			this.selectedVideo = video;
			this.onOpenPopup();
		};

		onSendVideo = ({screenId}) => {
			screenId = Array.isArray(screenId) ? screenId : [screenId];

			screenId.forEach(id => {
				this.props.onSendVideo({screenId: id, video: this.selectedVideo});
			});

			this.selectedVideo = {};
			this.onClosePopup();
		};

		onShowAdSpace = ({adContent, duration}) => {
			this.setState({adContent, showAd: true});
			this.adTimer.startAfter(duration);
		};

		render () {
			const {adContent, showAd, showPopup, url, videos} = this.state;

			const props = {
				...this.props,
				adContent,
				onClosePopup: this.onClosePopup,
				onSelectVideo: this.onSelectVideo,
				onSendVideo: this.onSendVideo,
				showAd,
				showPopup,
				url,
				videos
			};
			return (
				<React.Fragment>
					<Communicator
						host={appConfig.communicationServerHost}
						onPlayVideo={this.onPlayVideo}
						onShowAd={this.onShowAdSpace}
						screenId={this.state.screenId}
					/>
					<Wrapped {...props} />
				</React.Fragment>
			);
		}
	}
});

const Multimedia = MultimediaDecorator(MultimediaBase);

export default Multimedia;
export {Multimedia, MultimediaDecorator, ResponsiveVirtualList};
