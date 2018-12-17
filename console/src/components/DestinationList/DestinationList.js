import Divider from '@enact/agate/Divider';
import kind from '@enact/core/kind';
import {Column, Cell} from '@enact/ui/Layout';
import Button from '@enact/agate/Button';
import Group from '@enact/ui/Group';
import React from 'react';
import PropTypes from 'prop-types';
import {equals} from 'ramda';

import {propTypeLatLonList} from '../../data/proptypes';

const DestinationList = kind({
	name: 'DestinationList',

	propTypes: {
		positions: PropTypes.array.isRequired,
		destination: propTypeLatLonList,
		onSetDestination: PropTypes.func,
		title: PropTypes.string
	},

	computed: {
		selected: ({destination, positions}) => {
			let matchingDestIndex;

			// console.log('findDestinationInList:', {topLocations, destination});
			positions.forEach((loc, index) => {
				// console.log('comparing:', [loc.coordinates], 'and', destination);
				if (equals([loc.coordinates], destination)) {
					// console.log('MATCH!', index);
					matchingDestIndex = index;
				}
			});
			return matchingDestIndex;
		}
	},

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
						itemProps={{style: {marginTop: '15px'}, small: true, type: 'grid'}}
					>
						{
							positions.map(({description}, index) => `${index + 1} - ${description}`)
						}
					</Column>
				</Cell>
			</Column>
		);
	}
});

export default DestinationList;
