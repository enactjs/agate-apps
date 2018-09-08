import kind from '@enact/core/kind';
import Icon from '@enact/agate/Icon';
import React from 'react';

import css from './ContactThumbnail.less';
console.log(css)
const ContactThumbnail = kind({
	name: 'ContactThumbnail',

	styles: {
		css,
		className: 'contact-thumbnail'
	},

	render: ({contact, ...props}) => (
		<div {...props} style={{width: '200px'}}>
      <Icon>hollowstar</Icon>
      <div>
        <p className="contact-name">{contact.name}</p>
        <p className="contact-number">{contact.number}</p>
		  </div>
		</div>
	)
});

export default ContactThumbnail;
