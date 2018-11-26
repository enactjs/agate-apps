import kind from '@enact/core/kind';
import React from 'react';

import {ScreenSelectionPopup} from '../../../../components/ScreenSelectionPopup';
import CompactHeader from '../CompactHeader';
import CustomLayout from '../CustomLayout';
import {MultimediaDecorator, ResponsiveVirtualList} from '../../views/Multimedia';
import {getPanelIndexOf} from '../../App';

const screenIds = [1, 2];

const CompactMultimediaBase = kind({
	name: 'CompactMultimedia',

	handlers: {
		onTabChange: (ev, {onExpand}) => {
			if (ev.keyCode === 13 || ev.type === 'click') {
				onExpand({view: 'multimedia'});
			}
		}
	},

	render: ({showPopup, onClosePopup, onSelectVideo, onSendVideo, videos, noHeader, onTabChange, ...rest}) => {
		delete rest.adContent;
		delete rest.showAd;
		return (
			<React.Fragment>
				{!noHeader && <CompactHeader onExpand={onTabChange}>multimedia</CompactHeader>}
				<ScreenSelectionPopup
					showAllScreens
					onClose={onClosePopup}
					onSelect={onSendVideo}
					open={showPopup}
					screenIds={screenIds}
				/>
				<CustomLayout>
					<ResponsiveVirtualList
						{...rest}
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
