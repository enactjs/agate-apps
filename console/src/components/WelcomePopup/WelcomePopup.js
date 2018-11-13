import Button from '@enact/agate/Button';
import Divider from '@enact/agate/Divider';
import FullscreenPopup from '@enact/agate/FullscreenPopup';
import {Item} from '@enact/agate/Item';
import {Panel, Panels} from '@enact/agate/Panels';
import LabeledIconButton from '@enact/agate/LabeledIconButton';
import {handle, forward} from '@enact/core/handle';
import kind from '@enact/core/kind';
import {Column, Row, Cell} from '@enact/ui/Layout';
import Group from '@enact/ui/Group';
import PropTypes from 'prop-types';
import React from 'react';

import AppContextConnect from '../../App/AppContextConnect';
import MapCore from '../MapCore';

import css from './WelcomePopup.less';

const WelcomePopupBase = kind({
	name: 'WelcomePopup',

	propTypes: {
		index: PropTypes.number,
		onClose: PropTypes.func,
		onNextView: PropTypes.func,
		onPreviousView: PropTypes.func,
		updateUser: PropTypes.func,
		userId: PropTypes.number
	},

	defaultProps: {
		index: 0
	},

	styles: {
		css,
		className: 'welcomePopup'
	},

	handlers: {
		selectUserAndContinue: handle(
			forward('updateUser'),
			forward('onNextView')
		)
	},

	render: ({index, onClose, onPreviousView, selectUserAndContinue, userId, ...rest}) => {
		delete rest.onNextView;
		delete rest.updateUser;

		return (
			<FullscreenPopup {...rest}>
				<Panels index={index}>
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
					<Panel>
						<Column>
							<Cell shrink>
								<Row align="center">
									<Cell component={Button} icon="user" onClick={onPreviousView} shrink />
									<Cell component={Item} spotlightDisabled>
										Hi User {userId}!
									</Cell>
									<Cell component={Button} icon="arrowsmallright" onClick={onClose} shrink />
								</Row>
							</Cell>
							<Cell>
								<Row className={css.bottomRow}>
									<Cell shrink>
										<Column>
											<Cell component={Divider} startSection shrink>Top Locations</Cell>
											<Cell>
												<Column
													component={Group}
													childComponent={Cell}
													itemProps={{component: Button, shrink: true}}
													select="radio"
													selectedProp="selected"
													wrap
													align="start space-evenly"
												>
													{['Destination 1', 'Destination 2', 'Destination 3', 'Destination 4', 'Destination 5']}
												</Column>
											</Cell>
										</Column>
									</Cell>
									<Cell component={MapCore} />
									<Cell shrink>
										media
									</Cell>
								</Row>
							</Cell>
						</Column>
					</Panel>
				</Panels>
			</FullscreenPopup>
		);
	}
});

const WelcomePopup = AppContextConnect(({updateAppState, userId}) => ({
	updateUser: ({selected}) => {
		updateAppState((state) => {
			state.userId = selected + 1;
		});
	},
	userId
}))(WelcomePopupBase);

export default WelcomePopup;
export {
	WelcomePopup,
	WelcomePopupBase
};

