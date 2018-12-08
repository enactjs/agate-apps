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
		selected: PropTypes.number,  // The index of the currently selected position
		title: PropTypes.string
	},

	// computed: {
	// 	destinations: ({onSetDestination, positions}) => positions.map((item, i) => (
	// 		<Cell component={Button} small data-index={i} key={i} onClick={onSetDestination} shrink>
	// 			{`${i + 1} - ${item.description}`}
	// 		</Cell>
	// 	))
	// },

	render: ({positions, onSetDestination, selected, title, ...rest}) => {
		return (
			<Column {...rest}>
				<Cell component={Divider} shrink>{title}</Cell>
				<Cell>
					<Column
						component={Group}
						childComponent={Button}
						onSelect={onSetDestination}
						selectedProp="highlighted"
						selected={selected}
						itemProps={{small: true}}
					>
						{
							positions.map(({description}, index) => `${index + 1} - ${description}`)
							// 	return {
							// 		children: `${index + 1} - ${description}`,
							// 		key: `${description}-${index}`,
							// 		small: true
							// 		// 'data-index': index
							// 	};
							// })
						}
					</Column>
				</Cell>
			</Column>
		);
	}
});

export default DestinationList;
