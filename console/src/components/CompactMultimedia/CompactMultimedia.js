import {Cell, Column} from '@enact/ui/Layout';
import GridListImageItem from '@enact/agate/GridListImageItem';
import kind from '@enact/core/kind';
import React from 'react';

import {ScreenSelectionPopup} from '../../../../components/ScreenSelectionPopup';
import CompactHeader from '../CompactHeader';
import {MultimediaDecorator, ResponsiveVirtualList} from '../../views/Multimedia';
import css from './CompactMultimedia.less';

const screenIds = [1, 2];

const CompactMultimediaBase = kind({
	name: 'CompactMultimedia',
	styles: {
		css,
		className: 'compactMultimedia'
	},

	render: ({className, noHeader, onClosePopup, onExpand, onSelectVideo, onSendVideo, showPopup, videos, ...rest}) => {
		delete rest.adContent;
		delete rest.showAd;
		return (
			<React.Fragment>
				{!noHeader && <CompactHeader onExpand={onExpand} view="multimedia">Rear Screen</CompactHeader>}
				<ScreenSelectionPopup
					onClose={onClosePopup}
					onSelect={onSendVideo}
					open={showPopup}
					screenIds={screenIds}
					showAllScreens
				/>
				<Column className={className}>
					<Cell
						shrink
					>
						<GridListImageItem
							aspectRatio="16:9"
							caption={videos[0].snippet.title}
							className={css.rearScreenImage}
							css={css}
							source={videos[0].snippet.thumbnails.medium.url}
						/>
					</Cell>
					<Cell />
					<Cell
						component={ResponsiveVirtualList}
						dataSize={videos.length}
						direction="horizontal"
						onSelectVideo={onSelectVideo}
						size={192}
						videos={videos}
					/>
				</Column>
			</React.Fragment>
		);
	}
});

const CompactMultimedia = MultimediaDecorator(CompactMultimediaBase);

export default CompactMultimedia;
export {CompactMultimedia};
