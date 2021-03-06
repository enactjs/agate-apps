import Popup from '@enact/agate/Popup';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import {boolean, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const Config = mergeComponentMetadata('Popup', Popup);

storiesOf('Agate', module)
	.add(
		'Popup',
		withInfo({
			text: 'Basic usage of Popup'
		})(() => (
			<div>
				<Popup
					closeButton={boolean('closeButton', Config)}
					open={boolean('open', Config)}
					noAnimation={boolean('noAnimation', Config)}
					noAutoDismiss={boolean('noAutoDismiss', Config)}
					onCloseButtonClick={action('onCloseButtonClick')}
					onClose={action('onClose')}
					onHide={action('onHide')}
					scrimType={select('scrimType', ['none', 'translucent', 'transparent'], Config, 'translucent')}
					spotlightRestrict={select('spotlightRestrict', ['self-first', 'self-only'], Config, 'self-only')}
					title={text('title', Config, 'Title')}
				>
					<div>{text('children', Config, 'Hello Popup')}</div>
				</Popup>
				Use KNOBS to interact with Popup.
			</div>
		))
	);
