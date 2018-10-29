import AgateDecorator from '@enact/agate/AgateDecorator';
import {Cell, Row} from '@enact/ui/Layout';
import kind from '@enact/core/kind';
import openSocket from 'socket.io-client';
import React from 'react';

import css from './App.less';

const AppBase = kind({
	name: 'App',

	styles: {
		css,
		className: 'app enact-fit'
	},

	render: ({adContent, showAd, url, ...rest}) => {
		return (
			<Row {...rest}>
				<Cell
					allow="autoplay"
					component="iframe"
					src={url}
				/>
				{!showAd ? null :
				<Cell
					className={css.adSpace}
					shrink
				>
					{adContent}
				</Cell>}
			</Row>
		);
	}
});

class App extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			adContent: this.props.adContent || 'Your Ad Here',
			//TODO: make a better ID system
			id: 'copilot',
			showAd: this.props.showAd || false
		};
	}

	componentWillMount () {
		const {id} = this.state;
		this.socket = openSocket('http://localhost:3000');
		this.socket.on('PLAY_VIDEO', this.playVideo);
		this.socket.on('SHOW_AD', this.showAdSpace);
		this.socket.emit('COPILOT_CONNECT', {id});
	}

	componentWillUnmount () {
		this.socket.close();
	}

	hideAdSpace = () => {
		this.setState({adContent: '', showAd: false});
	};

	playVideo = ({url}) => {
		this.setState({url});
	};

	showAdSpace = ({adContent, duration}) => {
		this.setState({adContent, showAd: true});
		setTimeout(this.hideAdSpace, duration);
	};

	render () {
		const {...props} = this.state;

		return (
			<AppBase {...props} />
		);
	}
}

export default AgateDecorator(App);
