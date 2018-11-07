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
		index: PropTypes.number,
		onClose: PropTypes.func,
		onNextView: PropTypes.func,
		updateUser: PropTypes.func,
		userId: PropTypes.number
	},

	defaultProps: {
		index: 0
	},

	render: ({index, onClose, onNextView, updateUser, userId, ...rest}) => (
		<FullscreenPopup {...rest} onClose={onClose}>
			<Panels index={index}>
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
					<Button onClick={onNextView}>Select</Button>
				</Panel>
				<Panel>
					<Divider startSection>Welcome Screen</Divider>
					<Button onClick={onClose}>Close</Button>
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

