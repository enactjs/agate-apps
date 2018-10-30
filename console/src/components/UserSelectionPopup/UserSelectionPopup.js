import kind from '@enact/core/kind';
// import hoc from '@enact/core/hoc';
import Group from '@enact/ui/Group';
import Popup from '@enact/agate/Popup';
import Button from '@enact/agate/Button';
import SwitchItem from '@enact/agate/SwitchItem';
// import {Layout, Cell} from '@enact/ui/Layout';
// import PropTypes from 'prop-types';
import React from 'react';

import AppContextConnect from '../../App/AppContextConnect';

import css from './UserSelectionPopup.less';


const UserSelectionPopupBase = kind({
	name: 'UserSelectionPopup',

	// propTypes: {
	// 	date: PropTypes.object.isRequired,
	// 	orientation: PropTypes.string
	// },

	// defaultProps: {
	// 	date: new Date(),
	// 	orientation: 'vertical'
	// },

	styles: {
		css,
		className: 'userSelectionPopup'
	},

	// computed: {
	// },

	render: ({userId, updateUser, ...rest}) => (
		<Popup
			// onClose={onTogglePopup}
			// open={showPopup}
			closeButton
			{...rest}
		>
			<title>User Selection</title>

			<Group
				childComponent={SwitchItem}
				// itemProps={{
				// 	inline: boolean('ItemProps-Inline', Group)
				// }}
				select="radio"
				selectedProp="selected"
				defaultSelected={userId - 1}
				onSelect={updateUser}
			>
				{['User 1', 'User 2', 'User 3']}
			</Group>

			<buttons>
				<Button>Reset Current User</Button>
				<Button>Start Demo</Button>
			</buttons>
		</Popup>
	)
});

const UserSelectionPopup = AppContextConnect(({userId, updateAppState}) => ({
	userId: userId,
	updateUser: ({selected}) => {
		updateAppState((state) => {
			state.userId = selected + 1;
		});
	}
}))(UserSelectionPopupBase);


// const Tick = hoc((config, Wrapped) => {
// 	return class extends React.Component {
// 		static displayName = 'Tick';
// 		constructor (props) {
// 			super(props);
// 			this.state = {
// 				date: new Date()
// 			};
// 			window.setInterval(this.update, 1000);
// 		}
// 		update = () => this.setState({date: new Date()})
// 		render () {
// 			return (
// 				<Wrapped {...this.props} date={this.state.date} />
// 			);
// 		}
// 	};
// });

export default UserSelectionPopup;
export {
	UserSelectionPopup,
	UserSelectionPopupBase
};

