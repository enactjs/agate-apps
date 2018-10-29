import AgateDecorator from '@enact/agate/AgateDecorator';
import Item from '@enact/agate/Item';
import openSocket from 'socket.io-client';
import qs from 'query-string';
import React from 'react';
import Button from '@enact/agate/Button';
import SliderButton from '@enact/agate/SliderButton';
import css from './App.less';
import Popup from '@enact/agate/Popup';

const args = qs.parse(typeof window !== 'undefined' ? window.location.search : '');

class App extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			url: '',
			popupOpen: true,
			screenId: 1
		};
	}

	componentWillMount () {
		this.socket = openSocket('http://localhost:3000');
		this.listenForVideoChange(this.state.screenId);
	}

	componentDidUpdate (prevProps, prevState) {
		if (prevState.screenId !== this.state.screenId) {
			this.socket.removeAllListeners(`VIDEO_ADD_COPILOT/${prevState.screenId}`);
			this.listenForVideoChange(this.state.screenId);
		}
	}

	listenForVideoChange = (screenId) => {
		this.socket.on(`VIDEO_ADD_COPILOT/${screenId}`, (item) => {
			this.setState(() => {
				return {
					url: item.url
				};
			});
		});
	}

	onToggle = () => {
		this.setState(({popupOpen}) => {
			return {popupOpen: !popupOpen};
		});
	}


	play = (url, index) => () => {
		this.setState({index});
	}

	setScreen = (screenId) => () => {
		this.setState(() => {
			return {screenId: screenId};
		});
		this.onToggle();
	}

	render () {
		return (
			<div {...this.props} className={css.app}>
				<Popup
					open={this.state.popupOpen}
				>
					<title>
						Select Your Screen Source
					</title>
					<buttons>
						<Button onClick={this.setScreen(1)}>Screen 1</Button>
						<Button onClick={this.setScreen(2)}>Screen 2</Button>
					</buttons>
				</Popup>
				<iframe className={css.iframe} src={this.state.url} allow="autoplay" />
			</div>
		);
	}
}

export default AgateDecorator(App);
