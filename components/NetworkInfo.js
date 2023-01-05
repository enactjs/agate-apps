import hoc from '@enact/core/hoc';
// import PropTypes from 'prop-types';
import {Component} from 'react';
import {getIPv4} from 'webrtc-ips';

const NetworkInfo = hoc((configHoc, Wrapped) => {
	return class extends Component {
		static displayName = 'NetworkInfo';

		constructor (props) {
			super(props);

			this.awaitIp();

			this.state = {
				ip: null
			};
		}

		awaitIp = async () => {
			const ip = await getIPv4();
			this.setState({ip});
		};

		render () {
			return (<Wrapped {...this.props} ipAddress={this.state.ip} />);
		}
	};
});

export default NetworkInfo;
export {
	NetworkInfo
};
