import AgateDecorator from '@enact/agate/AgateDecorator';
import Item from '@enact/agate/Item';
import openSocket from 'socket.io-client';
import qs from 'query-string';
import React from 'react';
import Button from '@enact/agate/Button';
import css from './App.less';

const args = qs.parse(typeof window !== 'undefined' ? window.location.search : '');

class App extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			url: '',
			navOpen: false,
			itemList: [{title: 'lofi music live', url: 'https://www.youtube.com/embed/LsBrT6vbQa8?autoplay=1'}],
			index: 0
		};
	}

	componentWillMount () {
		const socket = openSocket('http://localhost:3000');
		socket.on('VIDEO_ADD_COPILOT', (item) => {
			const itemList = this.state.itemList.concat(item);
			this.setState(() => {
				return {itemList};
			});
		});
		socket.on('msg', event => console.log(event));
		socket.emit('msg', 'Copilot data.');
	}

	onToggle = () => {
		this.setState(({navOpen}) => {
			return {navOpen: !navOpen};
		});
	}

	play = (url, index) => () => {
		this.setState({index});
	}

	render () {
		const {url} = args;
		return (
			<div {...this.props} className={css.app}>
				<nav role="navigation">
					<div id="menuToggle">
						<Button icon={this.state.navOpen ? 'closex' : 'list'} onClick={this.onToggle} />
						<ul id="menu" className={css.list}>
							{
								this.state.itemList.map((item, index) => {
									return <Item style={{color:'white'}} key={index} onClick={this.play(item.url, index)}>{item.title}</Item>;
								})
							}
						</ul>
					</div>
				</nav>
				<iframe className={css.iframe} src={this.state.itemList[this.state.index].url} allow="autoplay" />
			</div>
		);
	}
}

export default AgateDecorator(App);
