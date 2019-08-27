import {Header, HeaderBase} from '@enact/agate/Header';
import Button from '@enact/agate/Button';
import IconButton from '@enact/agate/IconButton';
import React from 'react';
import {storiesOf} from '@storybook/react';

import {boolean, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

Header.displayName = 'Header';
const Config = mergeComponentMetadata('Header', HeaderBase, Header);

// Set up some defaults for children knob
const prop = {
	children: {
		'no buttons': null,
		'1 button': <IconButton>home</IconButton>,
		'2 buttons': <React.Fragment>
			<Button>A Button</Button>
			<IconButton>home</IconButton>
		</React.Fragment>
	}
};

storiesOf('Agate', module)
	.add(
		'Header',
		() => {
			const childrenSelection = select('children', ['no buttons', '1 button', '2 buttons'], Config);
			const children = prop.children[childrenSelection];

			const story = (
				<Header
					hideLine={boolean('hideLine', Config)}
					subtitle={text('subtitle', Config, 'Subtitle')}
					title={text('title', Config, 'Title')}
					titleAbove={text('titleAbove', Config, 'Title Above')}
				>
					{children}
				</Header>
			);
			return story;
		},
		{
			text: 'A block to use as a screen\'s title and description. Supports additional buttons, subtitle and title above.'
		}
	);
