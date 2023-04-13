import Heading from '@enact/agate/Heading';
import ImageItem from '@enact/agate/ImageItem';
import {Panel} from '@enact/agate/Panels';
import ThumbnailItem from '@enact/agate/ThumbnailItem';
import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
// import {Job} from '@enact/core/util';
import {Cell, Row} from '@enact/ui/Layout';
import ri from '@enact/ui/resolution';
import {VirtualGridList, VirtualList} from '@enact/ui/VirtualList';
import PropTypes from 'prop-types';
import {Component, Fragment} from 'react';

import appConfig from '../App/configLoader';
import Communicator from '../../../components/Communicator';
import CustomLayout from '../components/CustomLayout';
import ScreenSelectionPopup from '../../../components/ScreenSelectionPopup';
import youtubeVideos from '../data/youtubeapi.json';

import css from './Multimedia.module.less';

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

const ResponsiveVirtualList = kind({
	name: 'ResponsiveVirtualList',
	propTypes: {
		direction: PropTypes.string,
		onSelectVideo: PropTypes.func,
		size: PropTypes.string,
		videos: PropTypes.array
	},
	defaultProps: {
		direction: 'vertical'
	},
	styles: {
		css,
		className: 'mediaList'
	},
	computed: {
		// eslint-disable-next-line enact/display-name,enact/prop-types
		itemRenderer: ({onSelectVideo, size, styler, videos}) => ({index, ...rest}) => {
			const className = styler.append(css.listItem, size && css[size]);
			if (size === 'large') {
				return (
					<ThumbnailItem
						{...rest}
						className={className}
						css={css}
						onClick={onSelectVideo(videos[index])}
						src={videos[index].snippet.thumbnails.medium.url}
					>
						{videos[index].snippet.title}
					</ThumbnailItem>
				);
			}

			return (
				<ImageItem
					{...rest}
					className={className}
					src={videos[index].snippet.thumbnails.medium.url}
					onClick={onSelectVideo(videos[index])}
				>
					{size === 'full' || size === 'medium' ? videos[index].snippet.title : ''}
				</ImageItem>
			);
		}
	},
	render: ({size, direction, style = {}, ...rest}) => {
		let List, spacing, itemSize;

		switch (size) {
			case 'full': {
				List = VirtualGridList;
				// direction = direction || 'vertical';
				spacing = ri.scale(66);
				itemSize = {
					minWidth: ri.scale(320),
					minHeight: ri.scale(180)
				};
				break;
			}
			case 'large': {
				List = VirtualList;
				// direction = direction || 'vertical';
				spacing = ri.scale(24);
				itemSize = ri.scale(90);
				break;
			}
			case 'medium': {
				List = VirtualGridList;
				direction = direction || 'horizontal';
				spacing = ri.scale(24);
				itemSize = {
					minWidth: ri.scale(180),
					minHeight: ri.scale(135)
				};
				break;
			}
			case 'small': {
				List = VirtualGridList;
				direction = direction || 'vertical';
				spacing = ri.scale(12);
				itemSize = {
					minWidth: ri.scale(120),
					minHeight: ri.scale(72)
				};
				break;
			}
			default: {
				List = VirtualList;
				// direction = direction || 'vertical';
				spacing = ri.scale(15);
				itemSize = ri.scale(90);
			}
		}

		delete rest.onSelectVideo;
		delete rest.videos;
		return (
			<Cell
				{...rest}
				component={List}
				direction={direction}
				style={style}
				spacing={spacing}
				itemSize={itemSize}
			/>
		);
	}
});

const MultimediaBase = kind({
	name: 'Multimedia',

	propTypes: {
		// adContent: PropTypes.any,
		arrangeable: PropTypes.any,
		arrangement: PropTypes.any,
		onArrange: PropTypes.func,
		onClosePopup: PropTypes.func,
		onSelectVideo: PropTypes.func,
		onSendVideo: PropTypes.func,
		screenIds: PropTypes.array,
		// showAd: PropTypes.bool,
		showPopup: PropTypes.bool,
		url: PropTypes.string,
		videos: PropTypes.array
	},

	styles: {
		css,
		className: 'multimedia'
	},

	render: ({
		// adContent,
		arrangeable,
		arrangement,
		// showAd,
		showPopup,
		onArrange,
		onClosePopup,
		onSelectVideo,
		onSendVideo,
		screenIds,
		url,
		videos,
		...rest
	}) => {
		return (
			<Fragment>
				<ScreenSelectionPopup
					onClose={onClosePopup}
					onSelect={onSendVideo}
					open={showPopup}
					screenIds={screenIds}
					showAllScreens={showPopup}
				/>
				<Panel {...rest}>
					<CustomLayout
						arrangeable={arrangeable}
						arrangement={arrangement}
						onArrange={onArrange}
					>
						<left is="custom">
							<Cell shrink component={Heading} className={css.heading}>Recommended Videos</Cell>
							<Row className={css.bodyRow}>
								<Cell size={url ? "80%" : "0%"}>
									<IFrame allow="autoplay; fullscreen" className={css.iframe} src={url} />
								</Cell>
								<Cell size={url ? "20%" : "100%"}>
									<ResponsiveVirtualList
										dataSize={videos.length}
										onSelectVideo={onSelectVideo}
										size={url ? "medium" : "full"}
										videos={videos}
									/>
								</Cell>
							</Row>
						</left>
						<Row className={css.bodyRow}>
							{/* {showAd ? <Cell className={css.adSpace} shrink>
								{adContent}
							</Cell> : null}*/}
						</Row>
					</CustomLayout>
				</Panel>
			</Fragment>
		);
	}
});

const defaultConfig = {
	videos: youtubeVideos.items
};

const MultimediaDecorator = hoc(defaultConfig, (configHoc, Wrapped) => {
	return class extends Component {
		static displayName = 'MultimediaDecorator';

		static propTypes = {
			// adContent: PropTypes.any,
			onSendVideo: PropTypes.func,
			screenIds: PropTypes.array
			// showAd: PropTypes.bool
		};

		constructor (props) {
			super(props);

			this.state = {
				// adContent: this.props.adContent || 'Your Ad Here',
				screenId: 0,
				// showAd: this.props.showAd || false,
				url: '',
				videos: configHoc.videos
			};
			this.selectedVideo = {};

			// Job to control hiding ads
			// this.adTimer = new Job(this.onHideAdSpace);
		}

		onClosePopup = () => {
			this.setState({showPopup: false});
		};

		// onHideAdSpace = () => {
		// 	this.setState({adContent: '', showAd: false});
		// };

		onOpenPopup = () => {
			this.setState({showPopup: true});
		};

		onPlayVideo = ({url}) => {
			this.setState({url});
		};

		onSelectVideo = (video) => () => {
			const {screenIds} = this.props;
			this.selectedVideo = video;

			if (screenIds.length > 1) {
				this.onOpenPopup();
			} else {
				this.onSendVideo({screenId: screenIds[0]});
			}
		};

		onSendVideo = ({screenId}) => {
			screenId = Array.isArray(screenId) ? screenId : [screenId];

			screenId.forEach(id => {
				this.props.onSendVideo({screenId: id, video: this.selectedVideo});
			});

			this.selectedVideo = {};
			this.onClosePopup();
		};

		// onShowAdSpace = ({adContent, duration}) => {
		// 	this.setState({adContent, showAd: true});
		// 	this.adTimer.startAfter(duration);
		// };

		render () {
			const {showPopup, url, videos} = this.state;

			const props = {
				...this.props,
				// adContent,
				onClosePopup: this.onClosePopup,
				onSelectVideo: this.onSelectVideo,
				onSendVideo: this.onSendVideo,
				// showAd,
				showPopup,
				url,
				videos
			};
			return (
				<Fragment>
					<Communicator
						host={appConfig.communicationServerHost}
						onPlayVideo={this.onPlayVideo}
						// onShowAd={this.onShowAdSpace}
						screenId={this.state.screenId}
					/>
					<Wrapped {...props} />
				</Fragment>
			);
		}
	};
});

const Multimedia = MultimediaDecorator(MultimediaBase);

export default Multimedia;
export {Multimedia, MultimediaDecorator, ResponsiveVirtualList};
