import {Component, memo} from 'react';

import {AppContext} from './AppContextProvider';

const AppStateConnect = (mapContextToProps) => (Wrapped) => {
	const PureWrapped = memo(Wrapped);

	return class extends Component {
		static displayName = 'AppStateConnect';

		render () {
			return (
				<AppContext.Consumer>
					{(context) => {
						const contextProps = mapContextToProps(context, this.props);
						return <PureWrapped {...this.props} {...contextProps} />;
					}}
				</AppContext.Consumer>
			);
		}
	};
};

export default AppStateConnect;
export {
	AppStateConnect
};
