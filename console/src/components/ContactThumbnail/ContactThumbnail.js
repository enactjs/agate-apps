import IconItem from '@enact/agate/IconItem';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

import css from './ContactThumbnail.less';

const ContactThumbnail = kind({
	name: 'ContactThumbnail',

	propTypes: {
		contact: PropTypes.object,
		onSelect: PropTypes.func
	},

	styles: {
		css,
		className: 'contact-thumbnail'
	},

	handlers: {
		onSelect: (ev, {onSelect, contact}) => {
			if (onSelect) {
				onSelect({
					type: 'onSelect',
					contact
				});
			}
		}
	},

	render: ({contact, onSelect, ...props}) => (
		<div {...props} css={css} onClick={onSelect}>
			<IconItem icon="user" label={contact.number}>{contact.name}</IconItem>
		</div>
	)
});

export default ContactThumbnail;
