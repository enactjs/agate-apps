import kind from '@enact/core/kind';
import Icon from '@enact/agate/Icon';
import IconItem from '@enact/agate/IconItem';
import React from 'react';
import PropTypes from 'prop-types';

import css from './ContactThumbnail.less';

const ContactThumbnail = kind({
	name: 'ContactThumbnail',

	propTypes: {
		contact: PropTypes.object,
		onClick: PropTypes.func
	},

	styles: {
		css,
		className: 'contact-thumbnail',
		publicClassNames: ['contact-thumbnail', 'name']
	},

	handlers: {
		onClick: (ev, {onClick}) => {
			if (onClick) {
				onClick(ev.currentTarget.dataset.number)
			}
		}
	},

	render: ({contact, onClick, ...props}) => (
		<div {...props} css={css} onClick={onClick} data-number={contact.number}>
      <IconItem icon="user" label={contact.number} >{contact.name}</IconItem>
		</div>
	)
});

export default ContactThumbnail;
