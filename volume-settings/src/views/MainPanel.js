import {Cell, Row} from '@enact/ui/Layout';
import Divider from '@enact/agate/Divider'
import Icon from '@enact/agate/Icon';
import LS2Request from '@enact/webos/LS2Request';
import {Panel} from '@enact/agate/Panels';
import React from 'react';
import Slider from '@enact/agate/Slider';

import css from './MainPanel.module.less';

class MainPanel extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			isConstrolsHidden: true,
			mediaVolume: null,
			messageVolume: 20,
			safetyAlertVolume: 40
		};

		this.controlsDisplayTime = 5000;
		this.controlsDisplayTimeoutID = null;

		new LS2Request().send({
			service: 'luna://com.webos.service.audio/media/',
			method: 'status',
			parameters: {
				subscribe: true
			},
			onSuccess: (res) => {
				this.setState({mediaVolume: res.volume});
				this.onDisplayControls();
			}
		});

		this.onClicMute0 = this.onClickMute('media');
		this.onClicMute1 = this.onClickMute('message');
		this.onClicMute2 = this.onClickMute('safetyAlert');

		this.onClickMaxVolume0 = this.onClickMaxVolume('media');
		this.onClickMaxVolume1 = this.onClickMaxVolume('message');
		this.onClickMaxVolume2 = this.onClickMaxVolume('safetyAlert');

		this.onChangeVolume0 = this.onChangeVolume('media');
		this.onChangeVolume1 = this.onChangeVolume('message');
		this.onChangeVolume2 = this.onChangeVolume('safetyAlert');
	}

	onClickMute = (name) => () => {
		this.setState({[name + 'Volume']: 0});
		if (name === 'media') {
			new LS2Request().send({
				service: 'luna://com.webos.service.audio/media/',
				method: 'setVolume',
				parameters: {
					volume: 0
				}
			});
		}
		this.onDisplayControls();
	}

	onClickMaxVolume = (name) => () => {
		this.setState({[name + 'Volume']: 100});
		if (name === 'media') {
			new LS2Request().send({
				service: 'luna://com.webos.service.audio/media/',
				method: 'setVolume',
				parameters: {
					volume: 100
				}
			});
		}
		this.onDisplayControls();
	}

	onChangeVolume = (name) => ({value}) => {
		this.setState({[name + 'Volume']: value});
		if (name === 'media') {
			new LS2Request().send({
				service: 'luna://com.webos.service.audio/media/',
				method: 'setVolume',
				parameters: {
					volume: value
				}
			});
		}
		this.onDisplayControls();
	}

	onDisplayControls = () => {
		console.log("onDisplayControls");
		this.setState({isConstrolsHidden: false});
		if (this.controlsDisplayTimeoutID) {
			clearTimeout(this.controlsDisplayTimeoutID);
		}
		this.controlsDisplayTimeoutID = setTimeout(() => {
			this.setState({isConstrolsHidden: true});
		}, this.controlsDisplayTime);
	}

	render () {
		const {
			isConstrolsHidden,
			mediaVolume,
			messageVolume,
			safetyAlertVolume
		} = this.state;

		return (
			<Panel style={{visibility: isConstrolsHidden ? 'hidden' : 'visible'}} className={css.MainPanel} {...this.props}>
				<Row>
					<Cell component={Divider} size="35%">
						Media Volume
					</Cell>
					<Cell>
						<Icon onClick={this.onClicMute0}>{mediaVolume === 0 ? 'volume0' : 'volume1'}</Icon>
					</Cell>
					<Cell size="55%">
						<Slider
							max={100}
							min={0}
							value={mediaVolume}
							onChange={this.onChangeVolume0}
							orientation="horizontal"
							step={1}
						/>
					</Cell>
					<Cell>
						<Icon onClick={this.onClickMaxVolume0}>volume2</Icon>
					</Cell>
				</Row>
				<Row>
					<Cell component={Divider} size="35%">
						Message Volume
					</Cell>
					<Cell>
						<Icon onClick={this.onClicMute1}>{messageVolume === 0 ? 'volume0' : 'volume1'}</Icon>
					</Cell>
					<Cell size="55%">
						<Slider
							max={100}
							min={0}
							value={messageVolume}
							onChange={this.onChangeVolume1}
							orientation="horizontal"
							step={1}
						/>
					</Cell>
					<Cell>
						<Icon onClick={this.onClickMaxVolume1}>volume2</Icon>
					</Cell>
				</Row>
				<Row>
					<Cell component={Divider} size="35%">
						Safety Alert Message
					</Cell>
					<Cell>
						<Icon onClick={this.onClicMute2}>{safetyAlertVolume === 0 ? 'volume0' : 'volume1'}</Icon>
					</Cell>
					<Cell size="55%">
						<Slider
							max={100}
							min={0}
							value={safetyAlertVolume}
							onChange={this.onChangeVolume2}
							orientation="horizontal"
							step={1}
						/>
					</Cell>
					<Cell>
						<Icon onClick={this.onClickMaxVolume2}>volume2</Icon>
					</Cell>
				</Row>
			</Panel>
		);
	}
}

export default MainPanel;
