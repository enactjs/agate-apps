import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import {Component} from 'react';

import css from './Clock.module.less';

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const zeroPad = (val) => (val < 10 ? '0' + val : val);

const ClockBase = kind({
	name: 'Clock',

	propTypes: {
		date: PropTypes.object.isRequired,
		orientation: PropTypes.string
	},

	defaultProps: {
		date: new Date(),
		orientation: 'vertical'
	},

	styles: {
		css,
		className: 'clock'
	},

	computed: {
		dayOfWeek: ({date}) => dayNames[date.getDay()],
		month: ({date}) => monthNames[date.getMonth()],
		time: ({date}) => {
			let hour = date.getHours() % 12 || 12,
				min = zeroPad(date.getMinutes()),
				// sec = zeroPad(date.getSeconds()),
				ampm = (date.getHours() >= 12 ? 'pm' : 'am');

			return `${hour}:${min} ${ampm}`;
		}
	},

	render: ({date, dayOfWeek, month, time, ...rest}) => (
		<div {...rest}>
			{dayOfWeek}, {month} {date.getDate()} <wbr />
			{time}
		</div>
	)
});

const Tick = hoc((config, Wrapped) => {
	return class extends Component {
		static displayName = 'Tick';
		constructor (props) {
			super(props);
			this.state = {
				date: new Date()
			};
			this.ticker = global.setInterval(this.update, 1000);
		}
		componentWillUnmount () {
			global.clearInterval(this.ticker);
		}
		update = () => this.setState({date: new Date()});
		render () {
			return (
				<Wrapped {...this.props} date={this.state.date} />
			);
		}
	};
});

const Clock = Tick(ClockBase);

export default Clock;
