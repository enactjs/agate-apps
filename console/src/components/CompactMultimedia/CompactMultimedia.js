import kind from '@enact/core/kind';
import React from 'react';

import {ScreenSelectionPopup} from '../../../../components/ScreenSelectionPopup';

import CustomLayout from '../CustomLayout';
import {MultimediaDecorator, ResponsiveVirtualList} from '../../views/Multimedia';

const screenIds = [1, 2];

const CompactMultimediaBase = kind({
	name: 'CompactMultimedia',

	render: ({buttons, showPopup, onClosePopup, onSelectVideo, onSendVideo, videos, ...rest}) => {
		return (
			<React.Fragment>
				<ScreenSelectionPopup
					showAllScreens
					onClose={onClosePopup}
					onSelect={onSendVideo}
					open={showPopup}
					screenIds={screenIds}
				/>
				<CustomLayout>
					<ResponsiveVirtualList
						dataSize={videos.length}
						onSelectVideo={onSelectVideo}
						videos={videos}
					/>
				</CustomLayout>
			</React.Fragment>
		);
	}
});

const CompactMultimedia = MultimediaDecorator(CompactMultimediaBase);

export default CompactMultimedia;
export {CompactMultimedia};
