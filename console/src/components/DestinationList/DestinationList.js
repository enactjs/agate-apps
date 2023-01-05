import Button from '@enact/agate/Button';
import Heading from '@enact/agate/Heading';
import {MarqueeDecorator} from '@enact/agate/Marquee';
import kind from '@enact/core/kind';
import Group from '@enact/ui/Group';
import PropTypes from 'prop-types';
import {equals} from 'ramda';

import {propTypeLatLonList} from '../../data/proptypes';
import Marker from '../MapCore/Marker';

import css from './DestinationList.module.less';

const DestinationButton = (props) => {
	const {children, 'data-index': index, ...rest} = props;
	return <LocationButton size="small" {...rest} css={css}>
		<Marker css={css}>{index + 1}</Marker>
		{children}
	</LocationButton>;
};

const LocationButton = MarqueeDecorator({className: css.marquee})(Button); // used in order to be able to overwrite `text-align` from marquee

DestinationButton.propTypes = {
	'data-index': PropTypes.number
};

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
				<Heading spacing="medium" className={css.heading}>{title}</Heading>
				<Group
					component="div"
					childComponent={DestinationButton}
					onSelect={onSetDestination}
					selectedProp="highlighted"
					selected={selected}
				>
					{
						positions.map(({description}) => description)
					}
				</Group>
			</div>
		);
	}
});

export default DestinationList;
