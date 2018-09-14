import Button from '@enact/agate/Button';
import {ItemBase} from '@enact/agate/Item';

import Spottable from '@enact/spotlight/Spottable';
import Pure from '@enact/ui/internal/Pure';
import SlotItem from '@enact/ui/SlotItem';
import compose from 'ramda/src/compose';
import kind from '@enact/core/kind';
import React from 'react';

import css from './PresetItem.less';

const PresetItemBase = kind({
	name: 'PresetItem',

	propTypes:{},

	styles: {
		css,
		className: 'presetItem'
	},

	render: ({children, css, disabled, icon, label, titleIcon, ...rest}) => (

		<SlotItem
      className={css.item}
      component={ItemBase}
      disabled={disabled}
      css={css}
      {...rest}
    >
      {children}
      <slotAfter>
        <Button icon="plus" />
      </slotAfter>
		</SlotItem>
	)
});

const PresetItemDecorator = compose(
  Pure,
	Spottable
);

const PresetItem = PresetItemDecorator(PresetItemBase);

export default PresetItem;
