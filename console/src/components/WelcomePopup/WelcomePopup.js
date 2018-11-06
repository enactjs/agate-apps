import Button from '@enact/agate/Button';
import Divider from '@enact/agate/Divider';
import FullscreenPopup from '@enact/agate/FullscreenPopup';
import {Panel, Panels} from '@enact/agate/Panels';
import SwitchItem from '@enact/agate/SwitchItem';
import kind from '@enact/core/kind';
import Group from '@enact/ui/Group';
import PropTypes from 'prop-types';
import React from 'react';

import AppContextConnect from '../../App/AppContextConnect';

const WelcomePopupBase = kind({
	name: 'WelcomePopup',

	propTypes: {
		onClose: PropTypes.func,
		updateUser: PropTypes.func,
		userId: PropTypes.number
	},

	render: ({onClose, updateUser, userId, ...rest}) => (
		<FullscreenPopup {...rest} onClose={onClose}>
			<Panels>
				<Panel>
					<Divider startSection>User Selection</Divider>
					<Group
						childComponent={SwitchItem}
						defaultSelected={userId - 1}
						onSelect={updateUser}
						select="radio"
						selectedProp="selected"

					>
						{['User 1', 'User 2', 'User 3']}
					</Group>
					<Button onClick={onClose}>Select</Button>
				</Panel>
			</Panels>
		</FullscreenPopup>
	)
});

const WelcomePopup = AppContextConnect(({userId, updateAppState}) => ({
	userId: userId,
	updateUser: ({selected}) => {
		updateAppState((state) => {
			state.userId = selected + 1;
		});
	}
}))(WelcomePopupBase);

export default WelcomePopup;
export {
	WelcomePopup,
	WelcomePopupBase
};

