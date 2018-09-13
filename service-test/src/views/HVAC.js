import {Panel}               from '@enact/agate/Panels';
import Picker                from '@enact/agate/Picker';
import kind                  from '@enact/core/kind';
import {Row}                 from '@enact/ui/Layout';
import React                 from 'react';

import '../data/AFB-websock.js';

import css                   from './HVAC.less';

const temps = ['HI', '74°', '73°', '72°', '71°', '70°', '69°', '68°', '67°', '66°', 'LO'];

async function callbinder(api, verb, query, ws) {
	console.log('here', ws);
	// ws.call return a Promise
	return ws.call(api + '/' + verb, query)
	  .then(function (res) {
		console.log(res);
		// count++;
		return res;
	  })
	  .catch(function (err) {
		console.log(err);
		// count++;
		throw err;
	  });
  };

class HVAC extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			zone1Index: 0,
			zone2Index: 0
		}
		this.onOpen = this.onOpen.bind(this);
	}

	componentDidMount() {
		this.afb = new window.AFB(`api`, 'mysecret');
		this.ws = new this.afb.WS(this.onOpen);
	}

	componentDidUpdate(prevProps, prevState) {
		console.log(this.state);
	}


	findIndex = (temperature) => {
		const index = temps.findIndex((temp) => parseInt(temp) === temperature);
		console.log(index, temperature);
		return index;
	}

	async onOpen ()  {
		callbinder('hvac_mockup', 'auth', '', this.ws);
		let {response} = await callbinder('hvac_mockup', 'get-temperature', '{}', this.ws)

		this.setState({
			zone1Index: this.findIndex(response[0].temperature),
			zone2Index: this.findIndex(response[1].temperature)
		})
	}

	getTemperature = () => {
		// return callbinder('hvac_mockup', 'get-temperature', '{}', this.ws);
	}

	setTemerature = (zone, degree, index) => {
		callbinder('hvac_mockup', `set-temperature-zone${zone}`, {temperature: parseInt(degree)}, this.ws);
		const stateField = `zone${zone}Index`;
		this.setState({
			[stateField]: index
		})
	}

	render() {
		return (
			<Panel {...this.props}>
				<Row className={css.below} align="center space-around">
					<div>
						Zone 1
						<Picker
							orientation="vertical"
							index={this.state.zone1Index}
							onChange={({index, value}) => this.setTemerature(1, value, index)}
							className={css.picker}>
							{temps}
						</Picker>
					</div>
					<div>
						Zone 2
						<Picker
							orientation="vertical"
							index={this.state.zone2Index}
							onChange={({value, index}) => this.setTemerature(2, value, index)}
							className={css.picker}>
							{temps}
						</Picker>
					</div>
				</Row>
			</Panel>
		);
	}
}


export default HVAC;
export {
	HVAC as App,
	HVAC
};
