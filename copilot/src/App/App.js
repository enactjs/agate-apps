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
			// itemList: [{title: 'lofi music live', url: 'https://www.youtube.com/embed/LsBrT6vbQa8?autoplay=1'}],
			itemList: [],
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
		socket.emit('GET_VIDEOS', 'Copilot data.');
	}

	componentDidMount () {
		window.fetch('http://localhost:3000/items').then(response => {
			return response.json();
		}).then(itemList => this.setState({itemList}))
			.catch(err => console.log(err));
	}

	onToggle = () => {
		this.setState(({navOpen}) => {
			return {navOpen: !navOpen};
		});
	}

	deleteItem = (id) => () => {
		window.fetch('http://localhost:3000/items', {method: 'delete', data: {id}}).then(response => {
			console.log(response)
			return response.json();
		}).then(res => console.log(res))
			.catch(err => console.log(err));
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
									console.log(item);
									return <div style={{'display': 'inline'}}>
										<Button small icon={'closex'} onClick={this.deleteItem(item.id)} />
										<Item
											style={{color:'white'}}
											key={index}
											onClick={this.play(item.url, index)}
										>
											{item.title}
										</Item>
									</div>;
								})
							}
						</ul>
					</div>
				</nav>
				{this.state.itemList.length > 1 && <iframe className={css.iframe} src={this.state.itemList[this.state.index].url} allow="autoplay" />}
			</div>
		);
	}
}

export default AgateDecorator(App);
