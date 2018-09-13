import Button from '@enact/agate/Button';
import IconItem from '@enact/agate/IconItem';
import LabeledIconButton from '@enact/agate/LabeledIconButton';
import {TabbedPanels} from '@enact/agate/Panels';
import React from 'react';
import {action} from '@storybook/addon-actions';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';

import {select} from '../../src/enact-knobs';

TabbedPanels.displayName = 'TabbedPanels';

storiesOf('Agate', module)
	.add(
		'TabbedPanels',
		withInfo({
			text: 'The basic TabbedPanels'
		})(() => (
			<TabbedPanels
				onClick={action('onClick')}
				index={select('index', [0, 1, 2])}
				onSelect={action('onSelect')}
				orientation={select('orientation', ['vertical', 'horizontal'], TabbedPanels, 'vertical')}
				tabPosition={select('tabPosition', ['before', 'after'], TabbedPanels, 'before')}
				tabs={[
					{title: 'Button', icon: 'fullscreen'},
					{title: 'IconItem', icon: 'aircirculation'},
					{title: 'LabeledIconButton', icon: 'temperature'}
				]}
			>
				<beforeTabs>
					<Button small type="grid" icon="arrowhookleft" />
				</beforeTabs>
				<afterTabs>
					<Button small type="grid" icon="arrowhookright" />
				</afterTabs>
				<Button icon="fullscreen">Click me!</Button>
				<IconItem
					label="Label"
					icon="aircirculation"
					titleIcon="aircirculation"
				>
					Hello IconItem
				</IconItem>
				<LabeledIconButton
					labelPosition="after"
					icon="temperature"
				>
					Hello LabeledIconButton
				</LabeledIconButton>
			</TabbedPanels>
		))
	);
