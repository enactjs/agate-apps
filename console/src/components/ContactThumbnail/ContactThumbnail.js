import kind from '@enact/core/kind';
import Icon from '@enact/agate/Icon';
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
      <Icon>user</Icon>
      <div>
        <div className={css.name}>{contact.name}</div>
        <div className={css.number}>{contact.number}</div>
		  </div>
		</div>
	)
});

export default ContactThumbnail;
