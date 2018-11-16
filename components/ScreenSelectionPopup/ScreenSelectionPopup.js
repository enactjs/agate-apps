import Button from '@enact/agate/Button';
import Popup from '@enact/agate/Popup';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

const ScreenButton = kind({
	name: 'ScreenButton',

	propTypes: {
		onSelect: PropTypes.func,
		screenId: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.arrayOf(PropTypes.number)
		])
	},

	handlers: {
		onSelect: (ev, {onSelect, screenId}) => {
			onSelect({screenId});
		}
	},

	computed: {
		children: ({children, screenId}) => children || `Screen ${screenId}`
	},

	render: ({children, onSelect}) => {
		return (
			<Button onClick={onSelect}>
				{children}
			</Button>
		);
	}
});

const ScreenSelectionPopupBase = kind({
	name: 'ScreenSelectionPopup',

	propTypes: {
		onClose: PropTypes.func,
		onSelect: PropTypes.func,
		open: PropTypes.bool,
		screenIds: PropTypes.arrayOf(PropTypes.number),
		showAllScreens: PropTypes.bool,
		title: PropTypes.string
	},

	computed: {
		buttons: ({showAllScreens, screenIds, onSelect}) => {
			const screens = screenIds.map(s => {
				return (
					<ScreenButton key={s} screenId={s} onSelect={onSelect} />
				);
			});

			if (showAllScreens) {
				screens.push(
					<ScreenButton
						key={screens.length}
						screenId={screenIds}
						onSelect={onSelect}
					>
							All Screens
					</ScreenButton>
				);
			}

			return screens;
		}
	},

	render: ({buttons, children, open, onClose, title = 'Select Screen', ...rest}) => {
		return (
			<Popup
				{...rest}
				open={open}
				closeButton
				onClose={onClose}
				title={title}
			>
				{children}
				<buttons>
					{buttons}
				</buttons>
			</Popup>
		);
	}
});

export default ScreenSelectionPopupBase;
export {
	ScreenSelectionPopupBase as ScreenSelectionPopup,
	ScreenSelectionPopupBase
};
