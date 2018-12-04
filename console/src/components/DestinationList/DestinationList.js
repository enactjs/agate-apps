import Divider from '@enact/agate/Divider';
import kind from '@enact/core/kind';
import {Column, Cell} from '@enact/ui/Layout';
import Button from '@enact/agate/Button';
import Group from '@enact/ui/Group';
import React from 'react';
import PropTypes from 'prop-types';

const DestinationList = kind({
	name: 'DestinationList',

	propTypes: {
		positions: PropTypes.array.isRequired,
		onSetDestination: PropTypes.func,
		title: PropTypes.string
	},

	// computed: {
	// 	destinations: ({onSetDestination, positions}) => positions.map((item, i) => (
	// 		<Cell component={Button} small data-index={i} key={i} onClick={onSetDestination} shrink>
	// 			{`${i + 1} - ${item.description}`}
	// 		</Cell>
	// 	))
	// },

	render: ({positions, onSetDestination, title, ...rest}) => {
		return (
			<Column {...rest}>
				<Cell component={Divider} startSection shrink>{title}</Cell>
				<Cell>
					<Column>
						<Group childComponent={Button} onSelect={onSetDestination} selectedProp="highlighted">
							{positions ? positions.map(({description}, index) => {
								return {
									children: `${index + 1} - ${description}`,
									key: `${description}-${index + 1}`,
									small: true,
									'data-index': index
								};
							}) : []}
						</Group>
					</Column>
				</Cell>
			</Column>
		);
	}
});

export default DestinationList;
