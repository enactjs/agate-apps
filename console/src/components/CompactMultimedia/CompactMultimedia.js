import GridListImageItem from '@enact/agate/GridListImageItem';
import kind from '@enact/core/kind';
import {Cell, Column} from '@enact/ui/Layout';
import PropTypes from 'prop-types';
import React from 'react';

import {WidgetBase, WidgetDecorator} from '../Widget';

import {ScreenSelectionPopup} from '../../../../components/ScreenSelectionPopup';
import {MultimediaDecorator, ResponsiveVirtualList} from '../../views/Multimedia';

import css from './CompactMultimedia.less';

const screenIds = [1, 2];

const CompactMultimediaBase = kind({
	name: 'CompactMultimedia',

	propTypes: {
		adContent: PropTypes.any,
		containerShape: PropTypes.object,
		onClosePopup: PropTypes.func,
		onSelectVideo: PropTypes.func,
		onSendVideo: PropTypes.func,
		showAd: PropTypes.bool,
		showPopup: PropTypes.bool,
		videos: PropTypes.array
	},

	styles: {
		css,
		className: 'compactMultimedia'
	},

	computed: {
		className: ({containerShape: {size: {relative = 'small'}}, styler}) => {
			return styler.append(relative && css[relative]);
		},
		listCellSize: ({containerShape}) => containerShape.size.relative === 'large' ? 162 : 81,
		rearScreen1: ({videos}) => {
			const {snippet} = videos[0];
			return {
				imgSrc: snippet.thumbnails.medium.url,
				title: snippet.title
			};
		}
	},

	render: ({listCellSize, onClosePopup, onSelectVideo, onSendVideo, rearScreen1, showPopup, videos, ...rest}) => {
		delete rest.adContent;
		delete rest.showAd;

		return (
			<React.Fragment>
				<ScreenSelectionPopup
					onClose={onClosePopup}
					onSelect={onSendVideo}
					open={showPopup}
					screenIds={screenIds}
					showAllScreens
				/>
				<WidgetBase
					{...rest}
					view="multimedia"
					header="Rear Screen"
					small={
						<ResponsiveVirtualList
							dataSize={videos.length}
							direction="auto"
							onSelectVideo={onSelectVideo}
							videos={videos}
						/>
					}
					medium={
						<Column align="start space-between" style={{width: '100%'}}>
							<GridListImageItem
								aspectRatio="16:9"
								caption={rearScreen1.title}
								className={css.rearScreenImage}
								css={css}
								source={rearScreen1.imgSrc}
							/>
							<Cell
								component={ResponsiveVirtualList}
								dataSize={videos.length}
								direction="auto"
								onSelectVideo={onSelectVideo}
								shrink
								size={listCellSize}
								videos={videos}
							/>
						</Column>
					}
				/>
			</React.Fragment>
		);
	}
});

const CompactMultimedia = MultimediaDecorator(
	WidgetDecorator(
		CompactMultimediaBase
	)
);

export default CompactMultimedia;
export {
	CompactMultimedia
};
