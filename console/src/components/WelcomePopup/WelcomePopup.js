import Button from '@enact/agate/Button';
import Divider from '@enact/agate/Divider';
import kind from '@enact/core/kind';
import FullscreenPopup from '@enact/agate/FullscreenPopup';
import Group from '@enact/ui/Group';
import {Panel, Panels} from '@enact/agate/Panels';
import PropTypes from 'prop-types';
import React from 'react';
import SwitchItem from '@enact/agate/SwitchItem';

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
						select="radio"
						selectedProp="selected"
						defaultSelected={userId - 1}
						onSelect={updateUser}

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

