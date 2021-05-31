import Item from '@enact/agate/Item';
import Icon from '@enact/agate/Icon';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';

import css from './ContactThumbnail.module.less';

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
			<Item label={contact.number}>
				<Icon slot="slotBefore">user</Icon>
				{contact.name}
			</Item>
		</div>
	)
});

export default ContactThumbnail;
