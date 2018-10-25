import AgateDecorator from '@enact/agate/AgateDecorator';
import Button from '@enact/agate/Button';
import {Cell, Row} from '@enact/ui/Layout';
import kind from '@enact/core/kind';
import openSocket from 'socket.io-client';
import React from 'react';

import Playlist from '../views/Playlist';

import viewCss from './App.less';

const getItems = () => window.fetch('http://localhost:3000/items').then(response => {
	return response.json();
});

const AppBase = kind({
	name: 'App',
	styles: {
		css: viewCss,
		className: 'app'
	},
	computed: {
		url: ({itemList, url}) => !url && itemList.length ? itemList[0].url : url
	},
	render: ({itemList, navOpen, onDelete, onPlay, onToggle, url, ...rest}) => {
		delete rest.index;

		return (
			<Row {...rest}>
				{!navOpen ? null :
				<Cell component="nav" role="navigation" shrink>
					<div id="menuToggle">
						<Button icon={navOpen ? 'closex' : 'list'} onClick={onToggle} />
						<Playlist itemList={itemList} onDelete={onDelete} onPlay={onPlay} />
					</div>
				</Cell>}
				{itemList.length === 0 ? null :
				<Cell
					allow="autoplay"
					component="iframe"
					src={url}
				/>}
			</Row>
		);
	}
});

class App extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			url: '',
			navOpen: true,
			itemList: [],
			index: 0
		};
	}

	componentWillMount () {
		this.socket = openSocket('http://localhost:3000');
		this.socket.on('VIDEO_ADD_COPILOT', (item) => {
			const itemList = this.state.itemList.concat(item);
			this.setState(() => {
				return {itemList};
			});
		});
		this.socket.emit('GET_VIDEOS', 'Copilot data.');
	}

	componentDidMount () {
		getItems().then(itemList => this.setState({itemList}))
			.catch(err => console.error(err));
	}

	componentWillUnmount () {
		this.socket.close();
	}

	onDelete = ({id}) => {
		window.fetch(`http://localhost:3000/items/${id}`, {method: 'delete'}).then(response => {
			return response.json();
		}).then(() => getItems().then(itemList => this.setState({itemList})))
			.catch(err => console.error('Request failed', err));
	};

	onToggle = () => {
		this.setState(({navOpen}) => {
			return {navOpen: !navOpen};
		});
	};

	onPlay = ({url}) => {
		this.setState({url});
	};

	render () {
		console.log(this.state.itemList.length);
		const props = {
			...this.state,
			...this.props,
			onDelete: this.onDelete,
			onPlay: this.onPlay,
			onToggle: this.onToggle
		};
		return (
			<AppBase {...props} />
		);
	}
}

export default AgateDecorator(App);
