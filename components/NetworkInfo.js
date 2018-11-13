// import PropTypes from 'prop-types';
import React from 'react';
import hoc from '@enact/core/hoc';
import {getIPv4} from 'webrtc-ips';

const NetworkInfo = hoc((configHoc, Wrapped) => {
	return class extends React.Component {
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
			// console.log('ips:', ips);
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
