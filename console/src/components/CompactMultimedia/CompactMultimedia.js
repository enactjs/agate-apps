import kind from '@enact/core/kind';
import {Cell, Column} from '@enact/ui/Layout';
import PropTypes from 'prop-types';
import {Fragment} from 'react';

import {ScreenSelectionPopup} from '../../../../components/ScreenSelectionPopup';
import {MultimediaDecorator, ResponsiveVirtualList} from '../../views/Multimedia';
import {WidgetBase, WidgetDecorator} from '../Widget';

import componentCss from './CompactMultimedia.module.less';

const CompactMultimediaBase = kind({
	name: 'CompactMultimedia',

	propTypes: {
		screenIds: PropTypes.array.isRequired,
		adContent: PropTypes.any,
		containerShape: PropTypes.object,
		css: PropTypes.object,
		direction: PropTypes.string,
		onClosePopup: PropTypes.func,
		onSelectVideo: PropTypes.func,
		onSendVideo: PropTypes.func,
		showAd: PropTypes.bool,
		showPopup: PropTypes.bool,
		videos: PropTypes.array
	},

	styles: {
		css: componentCss,
		className: 'compactMultimedia',
		publicClassNames: true
	},

	computed: {
		className: ({containerShape: {size: {relative = 'small'}}, styler}) => {
			return styler.append(relative && componentCss[relative]);
		}
	},

	render: ({containerShape, css, direction, onClosePopup, onSelectVideo, onSendVideo, screenIds, showPopup, videos, ...rest}) => {
		delete rest.adContent;
		delete rest.showAd;

		const size = containerShape.size.relative || 'small';

		return (
			<Fragment>
				<ScreenSelectionPopup
					onClose={onClosePopup}
					onSelect={onSendVideo}
					open={showPopup}
					screenIds={screenIds}
					showAllScreens={showPopup}
				/>
				<WidgetBase
					{...rest}
					containerShape={containerShape}
					icon="rearscreen"
					title="Media"
					description="Send videos and music to the rear screen(s)"
					view="multimedia"
				>
					<Cell className={css.list}>
						<Column>
							<ResponsiveVirtualList
								dataSize={videos.length}
								direction={direction}
								onSelectVideo={onSelectVideo}
								size={size}
								videos={videos}
							/>
						</Column>
					</Cell>
				</WidgetBase>
			</Fragment>
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
