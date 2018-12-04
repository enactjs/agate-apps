import React from 'react';
import Pure from '@enact/ui/internal/Pure';
import {AppContext} from './AppContextProvider';
let thing = null;
const AppStateConnect = (mapContextToProps) => (Wrapped) => {
	const PureWrapped = Pure(Wrapped);

	return class extends React.Component {
		static displayName = 'AppStateConnect'

		render () {
			return (
				<AppContext.Consumer>
					{(context) => {
						const contextProps = mapContextToProps(context, this.props);
						if(Wrapped.displayName === 'ServiceLayer'){
							console.log('here');
							if(thing && contextProps){
								console.log(thing.setConnected === contextProps.setConnected, thing, contextProps);
							}
							thing = contextProps;
						}
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
