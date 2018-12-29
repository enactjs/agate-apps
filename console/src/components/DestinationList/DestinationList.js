import Divider from '@enact/agate/Divider';
import kind from '@enact/core/kind';
import Button from '@enact/agate/Button';
import Group from '@enact/ui/Group';
import React from 'react';
import PropTypes from 'prop-types';
import {equals} from 'ramda';

import {propTypeLatLonList} from '../../data/proptypes';

import css from './DestinationList.less';

const DestinationButton = (props) => (<Button small {...props} css={css} />);

const DestinationList = kind({
	name: 'DestinationList',

	propTypes: {
		positions: PropTypes.array.isRequired,
		destination: propTypeLatLonList,
		onSetDestination: PropTypes.func,
		title: PropTypes.string
	},

	styles: {
		css,
		className: 'destinationList'
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
			<div {...rest}>
				<Divider spacing="medium" className={css.heading}>{title}</Divider>
				<Group
					component="div"
					childComponent={DestinationButton}
					onSelect={onSetDestination}
					selectedProp="highlighted"
					selected={selected}
				>
					{
						positions.map(({description}, index) => `${index + 1} - ${description}`)
					}
				</Group>
			</div>
		);
	}
});

export default DestinationList;
