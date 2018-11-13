// proptypes.js
//
import PropTypes from 'prop-types';

// A single lat-lon object
const propTypeLatLon = PropTypes.shape({
	lat: PropTypes.number,
	lon: PropTypes.number
});

// A list of lat-lon objects
const propTypeLatLonList =  PropTypes.arrayOf(propTypeLatLon);

export {
	propTypeLatLon,
	propTypeLatLonList
};
