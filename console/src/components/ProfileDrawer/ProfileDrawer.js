import Drawer from '@enact/agate/Drawer';
import LabeledIconButton from '@enact/agate/LabeledIconButton';
import TabGroup from '@enact/agate/TabGroup';
import {ToggleButtonBase} from '@enact/agate/ToggleButton';
import {adaptEvent, forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import {Cell, Column} from '@enact/ui/Layout';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import {Fragment} from 'react';

import AppContextConnect from '../../App/AppContextConnect';
import UserAvatar from '../UserAvatar';
import UserSelectionPopup from '../UserSelectionPopup';

import componentCss from './ProfileDrawer.module.less';

const panelIndexes = [
	'home',
	'settings',
	'settings/theme'
];

const ProfileDrawerBase = kind({
	name: 'ProfileDrawer',

	propTypes: {
		getPanelIndexOf: PropTypes.func.isRequired,
		updateAppState: PropTypes.func.isRequired,
		userId: PropTypes.number.isRequired,
		css: PropTypes.object,
		index: PropTypes.number,
		layoutArrangeable: PropTypes.bool,
		onProfileEditEnd: PropTypes.func,
		onResetAll: PropTypes.func,
		onResetCopilot: PropTypes.func,
		onResetPosition: PropTypes.func,
		orientation: PropTypes.string,
		showUserSelectionPopup: PropTypes.bool,
		tabPosition: PropTypes.string,
		tabs: PropTypes.array,
		userName: PropTypes.string
	},

	defaultProps: {
		tabPosition: 'before',
		tabs: [
			{title: 'Home', icon: 'home'},
			{title: 'Settings', icon: 'setting'},
			{title: 'Theme', icon: 'display'}
		]
	},

	styles: {
		css: componentCss,
		className: 'profileDrawer',
		publicClassNames: true
	},

	handlers: {
		layoutArrangeableToggle: (ev, {updateAppState}) => {
			updateAppState((state) => {
				state.userSettings.arrangements.arrangeable = !state.userSettings.arrangements.arrangeable;
			});
		},
		onSelect: handle(
			adaptEvent(({selected}, {getPanelIndexOf}) => ({index: getPanelIndexOf(panelIndexes[selected])}), forward('onSelect'))
		),
		onToggleUserSelectionPopup: (ev, {updateAppState}) => {
			updateAppState((state) => {
				state.appState.showUserSelectionPopup = !state.appState.showUserSelectionPopup;
			});
		}
	},

	computed: {
		// All of this complexity so that we can identify which of the tabs should be "selected"
		// given the panel index from the app, which doesn't align 1:1 with our tab list index.
		// This looks up a panel in the app's list of panels, by name, which then correlates to the
		// index in our list of named tabs. Convoluted? Yes. Functional? Also yes.
		index: ({index, getPanelIndexOf}) => {
			let tabIndex;
			panelIndexes.forEach((name, i) => {
				if (getPanelIndexOf(name) === index) {
					tabIndex = i;
				}
			});
			return tabIndex;
		}
	},

	render: ({
		css,
		index,
		layoutArrangeable,
		layoutArrangeableToggle,
		onProfileEditEnd,
		onResetAll,
		onResetPosition,
		onResetCopilot,
		onSelect,
		onToggleUserSelectionPopup,
		orientation,
		showUserSelectionPopup,
		tabPosition,
		tabs,
		userId,
		userName,
		...rest
	}) => {
		delete rest.getPanelIndexOf;
		delete rest.updateAppState;
		return (
			<Fragment>
				<Drawer {...rest} css={css} scrimType="transparent">
					<TabGroup
						onSelect={onSelect}
						orientation="vertical"
						tabs={tabs}
						tabPosition={tabPosition}
						selected={index}
					>
						<beforeTabs>
							<div style={{textAlign: 'center'}}>
								<UserAvatar
									userId={userId - 1}
									onClick={onProfileEditEnd}
									style={{margin: (orientation === 'horizontal' ? '2em 1em' : '0.25em 1em')}}
								>
									{`Hi ${userName}!`}
								</UserAvatar>
							</div>
						</beforeTabs>
						<afterTabs>
							<Column align="center space-around">
								<Cell shrink>
									<LabeledIconButton
										onClick={onToggleUserSelectionPopup}
										labelPosition="after"
										icon="user"
									>
										Change Profile
									</LabeledIconButton>
								</Cell>
								<Cell
									style={{margin: '0.25em 1em 1em'}}
									align="stretch"
									component={ToggleButtonBase}
									onClick={layoutArrangeableToggle}
									selected={layoutArrangeable}
									shrink
									size="small"
									toggleOffLabel="Edit Layout"
									toggleOnLabel="Done"
									type="grid"
									underline
								/>
							</Column>
						</afterTabs>
					</TabGroup>
				</Drawer>
				<UserSelectionPopup
					onClose={onToggleUserSelectionPopup}
					onResetAll={onResetAll}
					open={showUserSelectionPopup}
					onResetPosition={onResetPosition}
					onResetCopilot={onResetCopilot}
				/>
			</Fragment>
		);
	}
});

const ProfileDrawerDecorator = compose(
	AppContextConnect(({appState, userSettings, userId, updateAppState}) => ({
		layoutArrangeable: userSettings.arrangements.arrangeable,
		orientation: (userSettings.skin !== 'carbon') ? 'horizontal' : 'vertical',
		open: appState.showProfileEdit,
		userId,
		userName: userSettings.name,
		updateAppState
	}))
);

const ProfileDrawer = ProfileDrawerDecorator(ProfileDrawerBase);

export default ProfileDrawer;
export {
	ProfileDrawer,
	ProfileDrawerBase
};
