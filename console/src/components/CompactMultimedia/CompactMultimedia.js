import {Cell, Column} from '@enact/ui/Layout';
import GridListImageItem from '@enact/agate/GridListImageItem';
import kind from '@enact/core/kind';
import React from 'react';
import {ResponsiveBox} from '@enact/agate/DropManager';

import Widget from '../Widget';

import {ScreenSelectionPopup} from '../../../../components/ScreenSelectionPopup';
import {MultimediaDecorator, ResponsiveVirtualList} from '../../views/Multimedia';

import css from './CompactMultimedia.less';

const screenIds = [1, 2];

const CompactMultimediaBase = ResponsiveBox(kind({
	name: 'CompactMultimedia',

	styles: {
		css,
		className: 'compactMultimedia'
	},

	computed: {
		className: ({containerShape: {size: {relative = 'small'}}, styler}) => styler.append(relative && css[relative]),
		listCellSize: ({containerShape: {size: {relative = 'small'}}}) => {
			if (relative === 'medium') {
				return 81;
			}

			if (relative === 'large') {
				return 162;
			}
			return '100%';
		},
		rearScreen1: ({videos}) => {
			const {snippet} = videos[0];
			return {
				imgSrc: snippet.thumbnails.medium.url,
				title: snippet.title
			};
		},
		size: ({containerShape: {size: {relative = 'small'}}}) => relative
	},

	render: ({className, listCellSize, onClosePopup, onSelectVideo, onSendVideo, rearScreen1, showPopup, size, videos, ...rest}) => {
		delete rest.adContent;
		delete rest.showAd;

		return (
			<Widget {...rest} view="multimedia" header="Rear Screen" style={{paddingBottom: 0}}>
				<ScreenSelectionPopup
					onClose={onClosePopup}
					onSelect={onSendVideo}
					open={showPopup}
					screenIds={screenIds}
					showAllScreens
				/>
				<Column align="start space-between" className={className}>
					{size === 'small' ? null : (
						<Cell
							shrink
						>
							<GridListImageItem
								aspectRatio="16:9"
								caption={rearScreen1.title}
								className={css.rearScreenImage}
								css={css}
								source={rearScreen1.imgSrc}
							/>
						</Cell>
					)}
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
			</Widget>
		);
	}
}));

const CompactMultimedia = MultimediaDecorator(CompactMultimediaBase);

export default CompactMultimedia;
export {CompactMultimedia};
