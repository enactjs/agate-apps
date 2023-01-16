import Item from '@enact/agate/Item';
import {forward} from '@enact/core/handle';
import kind from '@enact/core/kind';
import Spottable from '@enact/spotlight/Spottable';
import Pure from '@enact/ui/internal/Pure';
import Touchable from '@enact/ui/Touchable';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';

const PresetItemBase = kind({
	name: 'PresetItem',

	propTypes:{
		css: PropTypes.object,
		label: PropTypes.string,
		preset: PropTypes.number
	},

	handlers: {
		onClick: (ev, props) => {
			forward('onClick', {presetIndex: props.preset}, props);
		},
		onMouseDown: (ev, props) => {
			forward('onMouseDown', {presetIndex: props.preset, ...ev}, props);
		}
	},

	render: ({children, label, ...rest}) => (
		<Item {...rest} label={label} labelPosition="before">
			{children}
		</Item>
	)
});

const PresetItemDecorator = compose(
	Pure,
	Spottable,
	Touchable
);

const PresetItem = PresetItemDecorator(PresetItemBase);

export default PresetItem;
