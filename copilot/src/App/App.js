import AgateDecorator from '@enact/agate/AgateDecorator';
import Item from '@enact/agate/Item';
import openSocket from 'socket.io-client';
import React from 'react';
import Button from '@enact/agate/Button';
import css from './App.less';

const getItems = () => window.fetch('http://localhost:3000/items').then(response => {
	return response.json();
});

class App extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			url: '',
			navOpen: false,
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
		getItems().then(itemList => this.setState({itemList}))
			.catch(err => console.error(err));
	}

	onToggle = () => {
		this.setState(({navOpen}) => {
			return {navOpen: !navOpen};
		});
	}

	deleteItem = (id) => () => {
		window.fetch(`http://localhost:3000/items/${id}`, {method: 'delete'}).then(response => {
			return response.json();
		}).then(() => getItems().then(itemList => this.setState({itemList})))
			.catch(err => console.error('Request failed', err));
	}

	play = (url, index) => () => {
		this.setState({index});
	}

	render () {
		console.log(this.state.navOpen, css)
		return (
			<div {...this.props} className={css.app}>
				<Button
					icon={this.state.navOpen ? 'closex' : 'list'}
					onClick={this.onToggle} />
				<nav role="navigation" className={this.state.navOpen ? css.open : css.close}>
					<div id="menuToggle">
						<ul id="menu" className={css.list}>
							{
								this.state.itemList.map((item, index) => {
									return <div key={index} style={{'display': 'inline'}}>
										<Button small icon={'closex'} id={item.id} onClick={this.deleteItem(item.id)} />
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
				{this.state.itemList.length > 0 && <iframe className={css.iframe} src={this.state.itemList[this.state.index].url} allow="autoplay" />}
			</div>
		);
	}
}

export default AgateDecorator(App);
