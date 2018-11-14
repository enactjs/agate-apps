import Divider from '@enact/agate/Divider';
import kind from '@enact/core/kind';
import {Column, Cell} from '@enact/ui/Layout';
import React from 'react';
import PropTypes from 'prop-types';

const DestinationList = kind({
	name: 'DestinationList',

	propTypes: {
		component: PropTypes.func.isRequired,
		onSetDestination: PropTypes.func,
		positions: PropTypes.array,
		title: PropTypes.string
	},

	computed: {
		destinations: ({component: Component, onSetDestination, positions}) => positions.map((item, i) => (
			<Cell component={Component} data-index={i} key={i} onClick={onSetDestination} shrink>
				{`Destination ${i + 1}`}
			</Cell>
		))
	},

	render: ({destinations, title, ...rest}) => {
		delete rest.component;
		delete rest.onSetDestination;

		return (
			<Column {...rest}>
				<Cell component={Divider} startSection shrink>{title}</Cell>
				<Cell>
					<Column>
						{destinations}
					</Column>
				</Cell>
			</Column>
		);
	}
});

export default DestinationList;
