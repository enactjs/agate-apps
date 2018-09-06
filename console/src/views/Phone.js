import Button from '@enact/agate/Button';
import Input from '@enact/agate/Input';
import {Column, Cell} from '@enact/ui/Layout';
import {Panel} from '@enact/agate/Panels';
import React from 'react';

import Dialer from '../components/Dialer';

class Phone extends React.Component {
	static displayName = 'Phone';

	constructor (props) {
		super(props);
			this.state = {
				inputValue: ''
			}
			this.focusedIndex = 0;
	}

	onChange = (ev) => {
		this.setState(prevState => ({inputValue: prevState.inputValue + ev}));
	}

	handleInputClick = (ev) => {
		if (ev.target.selectionStart) {
			this.focusedIndex = ev.target.selectionStart
		} else if (ev.target.innerText === '⌫') {
			if (this.focusedIndex) {
				this.setState(prevState => ({
					inputValue: `${prevState.inputValue.slice(0, this.focusedIndex)}${prevState.inputValue.slice(this.focusedIndex + 1)}`
				}));
				this.focusedIndex -= 1;
			} else {
				this.setState(prevState => ({
					inputValue: `${prevState.inputValue.slice(0, -1)}`
				}));
			}
		}
	}

	render() {
		return (
			<Panel {...this.props}>
				<Column align="center">
					<Cell shrink className="number-field">
						<Input autoFocus onClick={this.handleInputClick} value={this.state.inputValue}/>
					</Cell>
					<Cell className="dialer-grid">
						<Dialer onChange={this.onChange}/>
					</Cell>
					<Cell shrink className="call">
						<Button type="grid" disabled={this.state.inputValue === ''} style={{width: '300px'}}>Call</Button>
					</Cell>
				</Column>
			</Panel>
		)
	}
}

export default Phone;
