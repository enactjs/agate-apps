import Divider from '@enact/agate/Divider';
import Image from '@enact/agate/Image';
import {Panel} from '@enact/agate/Panels';
import GridListImageItem from '@enact/agate/GridListImageItem';
import ThumbnailItem from '@enact/agate/ThumbnailItem';
import hoc from '@enact/core/hoc';
// import {Job} from '@enact/core/util';
import kind from '@enact/core/kind';
import {Cell, Column, Row} from '@enact/ui/Layout';
import ri from '@enact/ui/resolution';
import {VirtualGridList, VirtualList} from '@enact/ui/VirtualList';
import PropTypes from 'prop-types';
import React from 'react';

// import appConfig from '../App/configLoader';
import Communicator from '../../../components/Communicator';
import ScreenSelectionPopup from '../../../components/ScreenSelectionPopup';

import IconButton from '@enact/agate/IconButton';
import CustomLayout from '../components/CustomLayout';

import youtubeVideos from '../data/youtubeapi.json';
import sonyVideos from '../data/sonyapi.json';

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

const ListItemOverlay = kind({
	name: 'ListItemOverlay',

	render: () => (
		<Column align="center center">
			<IconButton size="small">arrowlargeright</IconButton>
		</Column>
	)
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
			const src = videos[index].snippet.thumbnails.medium.url;
			if (size === 'large') {
				return (
					<ThumbnailItem
						{...rest}
						className={className}
						css={css}
						onClick={onSelectVideo(videos[index])}
						src={src}
					>
						{videos[index].snippet.title}
					</ThumbnailItem>
				);
			}

			return (
				<GridListImageItem
					{...rest}
					aspectRatio="16:9"
					caption={size === 'full' ? videos[index].snippet.title : ''}
					className={className}
					source={src}
					onClick={onSelectVideo(videos[index])}
					selectionOverlay={ListItemOverlay}
					selectionOverlayShowing
				/>
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
					minHeight: ri.scale(100)
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
		id: PropTypes.string,
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

	computed: {
		video: ({id, url}) => {
			let src = '';
			if (window.multimedia === 'local') {
				src = `./assets/${id}.mp4`;
			} else if (window.multimedia === 'streaming') {
				src = url;
			}
			if (id || url) {
				if (window.multimedia === 'local' ||
					(window.multimedia === 'streaming' && window.multimediaProduct === 'sony')) {
					return (
						<video key={id || url} width="100%" height="100%" autoPlay controls controlsList="nodownload" disablePictureInPicture>
							<source src={src} type="video/mp4" />
						</video>
					);
				} else {
					return (
						<IFrame allow="autoplay" allowFullScreen className={css.iframe} src={src} />
					);
				}
			} else {
				return null;
			}
		}
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
		video,
		videos,
		...rest
	}) => {
		return (
			<React.Fragment>
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
						<left>
							<Column>
								{
									window.multimediaProduct === 'sony' ? (
										<div>
											<Cell shrink component={Image} className={css.sonyLogo} src="assets/sonylogo.png" />
											<Cell shrink component={Divider} className={css.divider}>Videos</Cell>
											<Cell shrink component={Divider} className={css.dividerSony}>Powered by Sony Pictures</Cell>
										</div>
									) : (
										<Cell shrink component={Divider} className={css.divider}>Recommended Videos</Cell>
									)
								}
								<Cell>
									<ResponsiveVirtualList
										dataSize={videos.length}
										onSelectVideo={onSelectVideo}
										size="full"
										videos={videos}
									/>
								</Cell>
							</Column>
						</left>
						<Row className={css.bodyRow}>
							{video}
							{/* {showAd ? <Cell className={css.adSpace} shrink>
								{adContent}
							</Cell> : null}*/}
						</Row>
					</CustomLayout>
				</Panel>
			</React.Fragment>
		);
	}
});

const defaultConfig = {
	videos: window.multimediaProduct === 'sony' ? sonyVideos.items : youtubeVideos.items
};

const MultimediaDecorator = hoc(defaultConfig, (configHoc, Wrapped) => {
	return class extends React.Component {
		static displayName = 'MultimediaDecorator';

		static propTypes = {
			// adContent: PropTypes.any,
			onSendVideo: PropTypes.func,
			screenIds: PropTypes.array
			// showAd: PropTypes.bool
		}

		constructor (props) {
			super(props);

			this.state = {
				// adContent: this.props.adContent || 'Your Ad Here',
				id: '',
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

		onPlayVideo = ({id, url}) => {
			this.setState({id, url});
		};

		onSelectVideo = (video) => () => {
			const {screenIds} = this.props;
			this.selectedVideo = video;

			// if (screenIds.length > 1) {
			// 	this.onOpenPopup();
			// } else {
			this.onSendVideo({screenId: screenIds[0]});
			// }
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
			const {id, showPopup, url, videos} = this.state;

			const props = {
				...this.props,
				// adContent,
				id,
				onClosePopup: this.onClosePopup,
				onSelectVideo: this.onSelectVideo,
				onSendVideo: this.onSendVideo,
				// showAd,
				showPopup,
				url,
				videos
			};

			const host = window.communicationServerHost;

			return (
				<React.Fragment>
					<Communicator
						host={host}
						onPlayVideo={this.onPlayVideo}
						// onShowAd={this.onShowAdSpace}
						screenId={this.state.screenId}
					/>
					<Wrapped {...props} />
				</React.Fragment>
			);
		}
	};
});

const Multimedia = MultimediaDecorator(MultimediaBase);

export default Multimedia;
export {Multimedia, MultimediaDecorator, ResponsiveVirtualList};
