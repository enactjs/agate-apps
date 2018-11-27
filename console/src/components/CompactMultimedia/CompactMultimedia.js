import kind from '@enact/core/kind';
import React from 'react';

import Widget from '../Widget';
import CustomLayout from '../CustomLayout';

import {ScreenSelectionPopup} from '../../../../components/ScreenSelectionPopup';
import {MultimediaDecorator, ResponsiveVirtualList} from '../../views/Multimedia';

import css from './CompactMultimedia.less';

const screenIds = [1, 2];

const CompactMultimediaBase = kind({
	name: 'CompactMultimedia',

	render: ({showPopup, onClosePopup, onSelectVideo, onSendVideo, videos, ...rest}) => {
		delete rest.adContent;
		delete rest.showAd;

		return (
			<Widget {...rest} view="multimedia" header="Multimedia">
				<ScreenSelectionPopup
					showAllScreens
					onClose={onClosePopup}
					onSelect={onSendVideo}
					open={showPopup}
					screenIds={screenIds}
				/>
				<CustomLayout className={css.list}>
					<ResponsiveVirtualList
						{...rest}
						dataSize={videos.length}
						onSelectVideo={onSelectVideo}
						videos={videos}
					/>
				</CustomLayout>
			</Widget>
		);
	}
});

const CompactMultimedia = MultimediaDecorator(CompactMultimediaBase);

export default CompactMultimedia;
export {CompactMultimedia};
