import Button from '@enact/agate/Button';
import {Cell, Row} from '@enact/ui/Layout';
import Divider from '@enact/agate/Divider';
import GridListImageItem from '@enact/ui/GridListImageItem';
import Job from '@enact/core/util/Job';
import kind from '@enact/core/kind';
import {Panel} from '@enact/agate/Panels';
import Popup from '@enact/agate/Popup';
import PropTypes from 'prop-types';
import React from 'react';
import ri from '@enact/ui/resolution';
import ThumbnailItem from '@enact/agate/ThumbnailItem';
import {VirtualGridList, VirtualList} from '@enact/ui/VirtualList';

import appConfig from '../../config';
import Communicator from '../../../components/Communicator';
import CustomLayout from '../components/CustomLayout';

import youtubeVideos from '../data/youtubeapi.json';

import css from './Multimedia.less';

const screenIds = [0, 1, 2];

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

const MultimediaBase = kind({
	name: 'Multimedia',

	styles: {
		css,
		className: 'multimedia'
	},

	computed: {
		buttons: ({compact, onBroadcastVideo, onSendVideo}) => {
			const ids = [...screenIds];
			if (compact) {
				ids.shift();
			}
			const screens = ids.map((s, index) => {
				return (<Button key={index} onClick={onSendVideo(s)}>Screen {s}</Button>);
			});
			screens.push(<Button key={screens.length} onClick={onBroadcastVideo}>All Screens</Button>);
			return screens;
		},
		itemSize: ({compact}) => {
			if (compact) {
				return ri.scale(90);
			}
			return {
				minWidth: ri.scale(320),
				minHeight: ri.scale(180)
			};
		},
		itemSpacing: ({compact}) => {
			if (compact) {
				return ri.scale(15);
			}
			return ri.scale(66);
		},
		listComponent: ({compact}) => (compact ? VirtualList : VirtualGridList),
		/**
		 *
		 * @param listSlot
		 * @return {string}
		 *
		 * Used to determine which slot of the `CustomLayout` should hold the list information.
		 * If `compact` is `true`, the empty string will cause the the list to be rendered
		 * in the `children` slot and ignore the declared JSX children.  This is how we handle
		 * changing what is displayed between compact and full modes.
		 */
		listSlot: ({compact}) => (compact ? '' : 'left'),
		renderItem: ({compact, onSelectVideo, videos}) => ({index, ...rest}) => {
			if (compact) {
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
	},

	render: ({
		adContent,
		arrangeable,
		arrangement,
		buttons,
		compact,
		itemSize,
		itemSpacing,
		listComponent: List,
		listSlot,
		onArrange,
		renderItem,
		showAd,
		showPopup,
		onTogglePopup,
		url,
		videos,
		...rest
	}) => {
		delete rest.onBroadcastVideo;
		delete rest.onSelectVideo;
		delete rest.onSendVideo;
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
				<Panel {...rest}>
					<CustomLayout
						arrangeable={arrangeable}
						arrangement={arrangement}
						onArrange={onArrange}
					>
						<div
							className={css.bodyRow}
							slot={listSlot}
						>
							{compact ? null : <Divider className={css.divider}>
								Recommended Videos
							</Divider>}
							<List
								dataSize={videos.length}
								itemRenderer={renderItem}
								itemSize={itemSize}
								spacing={itemSpacing}
							/>
						</div>
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

class Multimedia extends React.Component {
	static propTypes = {
		onSendVideo: PropTypes.func
	};

	constructor (props) {
		super(props);
		this.state = {
			adContent: this.props.adContent || 'Your Ad Here',
			screenId: 0,
			showAd: this.props.showAd || false,
			url: '',
			videos: youtubeVideos.items
		};
		this.selectedVideo = {};

		// Job to control hiding ads
		this.adTimer = new Job(this.onHideAdSpace);
	}

	onBroadcastVideo = () => {
		const video = this.selectedVideo; // onSendVideo will reset this.selectedVideo
		const ids = [...screenIds];
		if (this.props.compact) {
			ids.shift();
		}
		ids.forEach((s) => {
			this.selectedVideo = video;
			this.onSendVideo(s)();
		});
	};

	onHideAdSpace = () => {
		this.setState({adContent: '', showAd: false});
	};

	onPlayVideo = ({url}) => {
		this.setState({url});
	};

	onSelectVideo = (video) => () => {
		this.selectedVideo = video;
		this.onTogglePopup();
	};

	onSendVideo = (screenId) => () => {
		this.props.onSendVideo({screenId, video: this.selectedVideo});
		this.selectedVideo = {};
		this.onTogglePopup();
	};

	onShowAdSpace = ({adContent, duration}) => {
		this.setState({adContent, showAd: true});
		this.adTimer.startAfter(duration);
	};

	onTogglePopup = () => {
		this.setState(({showPopup}) => ({showPopup: !showPopup}));
	};

	render () {
		const {adContent, showAd, showPopup, url, videos} = this.state;

		const props = {
			...this.props,
			adContent,
			onBroadcastVideo: this.onBroadcastVideo,
			onSelectVideo: this.onSelectVideo,
			onSendVideo: this.onSendVideo,
			onTogglePopup: this.onTogglePopup,
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
				<MultimediaBase {...props} />
			</React.Fragment>
		);
	}
}

export default Multimedia;
