import BodyText from '@enact/agate/BodyText';
import Dropdown from '@enact/agate/Dropdown';
import Heading from '@enact/agate/Heading';
import Item from '@enact/agate/Item';
import {Panel} from '@enact/agate/Panels';
import Scroller from '@enact/agate/Scroller';
import SwitchItem from '@enact/agate/SwitchItem';
import kind from '@enact/core/kind';
import {Cell, Column, Row} from '@enact/ui/Layout';
import PropTypes from 'prop-types';

import {getPanelIndexOf} from '../App';
import NetworkInfo from '../../../components/NetworkInfo';

import viewCss from './Settings.module.less';

const SwitchItemCell =  kind({
	name: 'SwitchItemCell',

	propTypes: {
		css: PropTypes.object,
		noToggle: PropTypes.bool
	},

	styles: {
		css: viewCss,
		className: 'switchItem'
	},

	computed: {
		className: ({css, noToggle, styler}) => styler.append(noToggle ? css.noToggle : '')
	},

	render: ({css, ...rest}) => {
		delete rest.noToggle;
		return (
			<Cell shrink>
				<SwitchItem css={css} {...rest} />
			</Cell>
		);
	}
});

const Settings = kind({
	name: 'Settings',

	propTypes: {
		css: PropTypes.object,
		ipAddress: PropTypes.string,
		mapsLibrary: PropTypes.number,
		onMapsSelect: PropTypes.func,
		onReloadApp: PropTypes.func,
		onSelect: PropTypes.func,
		onToggleDateTimePopup: PropTypes.func
	},

	styles: {
		css: viewCss,
		className: 'settingsView'
	},

	handlers: {
		onSelect: (ev, {onSelect}) => {
			onSelect({index: parseInt(ev.currentTarget.dataset.tabindex)});
		}
	},

	render: ({css, ipAddress, mapsLibrary, onMapsSelect, onSelect, onToggleDateTimePopup, onReloadApp, ...rest}) => (
		<Panel {...rest}>
			<Row className="enact-fit" align=" center">
				<Cell size="50%">
					<Column className={css.content}>
						<Cell
							component={Heading}
							showLine
							shrink
							spacing="none"
						>
							Settings
						</Cell>
						<Scroller>
							<SwitchItemCell
								icon="edit"
								noToggle
								data-tabindex={getPanelIndexOf('settings/theme')}
								onClick={onSelect}
							>
								Theme
							</SwitchItemCell>
							<BodyText size="small">Maps Library</BodyText>
							<Dropdown
								onSelect={onMapsSelect}
								title="Select a library"
								selected={mapsLibrary}
							>
								{['Google Maps', 'Mapbox GL']}
							</Dropdown>
							<SwitchItemCell
								icon="datetime"
								noToggle
								onClick={onToggleDateTimePopup}
							>
								Date & Time
							</SwitchItemCell>
							<SwitchItemCell
								icon="bluetooth"
							>
								Bluetooth
							</SwitchItemCell>
							<SwitchItemCell
								icon="wifi"
							>
								WiFi
							</SwitchItemCell>
							<SwitchItemCell
								icon="fan"
							>
								Turbo
							</SwitchItemCell>
							<SwitchItemCell
								icon="heatseatright"
								switchOffLabel="disarmed"
								switchOnLabel="armed"
							>
								Ejection Seat
							</SwitchItemCell>
							<SwitchItemCell
								noToggle
								onClick={onReloadApp}
							>
								Reload Apps
							</SwitchItemCell>
							<Item label={ipAddress}>IP Address</Item>
						</Scroller>
					</Column>
				</Cell>
			</Row>
		</Panel>
	)
});

export default NetworkInfo(Settings);
