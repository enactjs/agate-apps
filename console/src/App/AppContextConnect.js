import React from 'react';
import Pure from '@enact/ui/internal/Pure';
import {AppContext} from './AppContextProvider';

const AppStateConnect = (mapContextToProps) => (Wrapped) => {
	const PureWrapped = Pure(Wrapped);

	return class extends React.Component {
		static displayName = 'AppStateConnect'

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
