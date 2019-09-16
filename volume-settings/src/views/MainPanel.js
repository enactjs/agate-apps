import Divider from '@enact/agate/Divider'
import Icon from '@enact/agate/Icon';
import {Panel} from '@enact/agate/Panels';
import Slider from '@enact/agate/Slider';
import {Cell, Row} from '@enact/ui/Layout';
import LS2Request from '@enact/webos/LS2Request';
import React from 'react';

import css from './MainPanel.module.less';

const
	lunaService = {service: 'luna://com.webos.service.audio/media/'},
	lunaStatusMethod = {method: 'status'},
	luanSetMethod = {method: 'setVolume'};

class MainPanel extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			isConstrolsHidden: true,
			mediaVolume: null,
			messageVolume: 20,
			safetyAlertVolume: 40
		};

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

		this.onClicMuteMedia = this.onClickMute('media');
		this.onClicMuteMessage = this.onClickMute('message');
		this.onClicMuteSafetyAlert = this.onClickMute('safetyAlert');

		this.onClickMaxVolumeMedia = this.onClickMaxVolume('media');
		this.onClickMaxVolumeMessage = this.onClickMaxVolume('message');
		this.onClickMaxVolumeSafetyAlert = this.onClickMaxVolume('safetyAlert');

		this.onChangeVolumeMedia = this.onChangeVolume('media');
		this.onChangeVolumeMessage = this.onChangeVolume('message');
		this.onChangeVolumeSafetyAlert = this.onChangeVolume('safetyAlert');
	}

	componentWillUnmount () {
		if (this.controlsDisplayTimeoutID) {
			clearTimeout(this.controlsDisplayTimeoutID);
		}
	}

	controlsDisplayTime = 5000
	controlsDisplayTimeoutID = null

	onClickMute = (name) => () => {
		this.setState({[name + 'Volume']: 0});
		if (name === 'media') {
			new LS2Request().send({
				lunaService,
				lunaStatusMethod,
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
				lunaService,
				luanSetMethod,
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
				lunaService,
				luanSetMethod,
				parameters: {
					volume: value
				}
			});
		}
		this.onDisplayControls();
	}

	onDisplayControls = () => {
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
						<Icon onClick={this.onClicMuteMedia}>{mediaVolume === 0 ? 'volume0' : 'volume1'}</Icon>
					</Cell>
					<Cell size="55%">
						<Slider
							max={100}
							min={0}
							value={mediaVolume}
							onChange={this.onChangeVolumeMedia}
							orientation="horizontal"
							step={1}
						/>
					</Cell>
					<Cell>
						<Icon onClick={this.onClickMaxVolumeMedia}>volume2</Icon>
					</Cell>
				</Row>
				<Row>
					<Cell component={Divider} size="35%">
						Message Volume
					</Cell>
					<Cell>
						<Icon onClick={this.onClicMuteMessage}>{messageVolume === 0 ? 'volume0' : 'volume1'}</Icon>
					</Cell>
					<Cell size="55%">
						<Slider
							max={100}
							min={0}
							value={messageVolume}
							onChange={this.onChangeVolumeMessage}
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
						<Icon onClick={this.onClicMuteSafetyAlert}>{safetyAlertVolume === 0 ? 'volume0' : 'volume1'}</Icon>
					</Cell>
					<Cell size="55%">
						<Slider
							max={100}
							min={0}
							value={safetyAlertVolume}
							onChange={this.onChangeVolumeSafetyAlert}
							orientation="horizontal"
							step={1}
						/>
					</Cell>
					<Cell>
						<Icon onClick={this.onClickMaxVolumeSafetyAlert}>volume2</Icon>
					</Cell>
				</Row>
			</Panel>
		);
	}
}

export default MainPanel;
