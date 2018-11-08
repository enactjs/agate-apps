import Divider from '@enact/agate/Divider';
import FullscreenPopup from '@enact/agate/FullscreenPopup';
import {Panel, Panels} from '@enact/agate/Panels';
import LabeledIconButton from '@enact/agate/LabeledIconButton';
import {handle, forward} from '@enact/core/handle';
import kind from '@enact/core/kind';
import {Column, Row, Cell} from '@enact/ui/Layout';
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

	handlers: {
		selectUserAndContinue: handle(
			forward('updateUser'),
			// After the personalized welcome screen is added, that transition will be added here
			// and `onClose` will be applied to the "GO" button (to be added later) and will be
			// removed from here.
			forward('onClose')
		)
	},

	render: ({selectUserAndContinue, ...rest}) => {
		delete rest.onClose;
		delete rest.updateUser;
		// delete rest.userId;
		return (
			<FullscreenPopup {...rest}>
				<Panels>
					<Panel>
						<Column align="stretch center">
							<Cell component={Divider} startSection shrink>User Selection</Cell>
							<Cell shrink>
								<Row
									component={Group}
									childComponent={Cell}
									itemProps={{component: LabeledIconButton, shrink: true, icon: 'user'}}
									onSelect={selectUserAndContinue}
									select="radio"
									selectedProp="selected"
									wrap
									align="start space-evenly"
								>
									{['User 1', 'User 2', 'User 3']}
								</Row>
							</Cell>
						</Column>
					</Panel>
				</Panels>
			</FullscreenPopup>
		);
	}
});

const WelcomePopup = AppContextConnect(({updateAppState}) => ({
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

