import AgateDecorator from '@enact/agate/AgateDecorator';
import Item from '@enact/agate/Item';
import openSocket from 'socket.io-client';
import qs from 'query-string';
import React from 'react';
import Button from '@enact/agate/Button';
import SliderButton from '@enact/agate/SliderButton';
import css from './App.less';

const args = qs.parse(typeof window !== 'undefined' ? window.location.search : '');

class App extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			url: '',
			navOpen: false,
			itemList: [],
			index: 0,
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
			console.log('he')
			this.setState(() => {
				return {url: item.url};
			});
		});
	}

	onToggle = () => {
		this.setState(({navOpen}) => {
			return {navOpen: !navOpen};
		});
	}

	switchUser = ({value}) => {
		this.setState(() => {
			return {screenId: value + 1};
		});
	}

	play = (url, index) => () => {
		this.setState({index});
	}

	render () {
		return (
			<div {...this.props} className={css.app}>
				<nav role="navigation">
					<div id="menuToggle">
						<Button icon={this.state.navOpen ? 'closex' : 'list'} onClick={this.onToggle} />
						<SliderButton value={this.state.screenId - 1} onChange={this.switchUser}>{['User 1', 'User 2']}</SliderButton>
					</div>
				</nav>
				<iframe className={css.iframe} src={this.state.url} allow="autoplay" />
			</div>
		);
	}
}

export default AgateDecorator(App);
