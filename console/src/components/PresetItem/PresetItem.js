import {ItemBase} from '@enact/agate/Item';
import {LabeledItemBase} from '@enact/agate/LabeledItem';

import {forward, handle} from '@enact/core/handle';
import Spottable from '@enact/spotlight/Spottable';
import Pure from '@enact/ui/internal/Pure';
import SlotItem from '@enact/ui/SlotItem';
import Touchable from '@enact/ui/Touchable';
import compose from 'ramda/src/compose';
import kind from '@enact/core/kind';
import React from 'react';

import componentCss from './PresetItem.less';

const PresetItemBase = kind({
	name: 'PresetItem',

	propTypes:{},

	styles: {
		css: componentCss,
		className: 'presetItem'
	},

	handlers: {
		onClick: (ev, props) => {
			forward('onClick', {presetIndex: props.preset}, props)
		},
		onMouseDown: (ev, props) => {
			forward('onMouseDown', {presetIndex: props.preset, ...ev}, props)
		}
	},

	render: ({children, css, disabled, icon, label, ...rest}) => (
		<SlotItem
			component={ItemBase}
			disabled={disabled}
			css={css}
			{...rest}
		>
			<LabeledItemBase label={label} labelPosition="before">
				{children}
			</LabeledItemBase>
		</SlotItem>
	)
});

const PresetItemDecorator = compose(
	Pure,
	Spottable,
	Touchable
);

const PresetItem = PresetItemDecorator(PresetItemBase);

export default PresetItem;
