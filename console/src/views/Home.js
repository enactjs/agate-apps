import {Panel} from '@enact/agate/Panels';
import kind from '@enact/core/kind';
import {Row, Column, Cell} from '@enact/ui/Layout';
import React from 'react';
import CompactRadio from '../components/CompactRadio';
import CompactHvac from '../components/CompactHVAC';
import AppIconCell from '../components/AppIconCell';

import css from './Home.less';

const Home = kind({
	name: 'Home',

	handlers: {
		onTabChange: (ev, {onSelect}) => {
			if ((ev.keyCode === 13 || ev.type === 'click') && ev.currentTarget.dataset.tabindex) {
				onSelect({index: parseInt(ev.currentTarget.dataset.tabindex)});
			}
		}
	},

	render: ({onTabChange, ...rest}) => {
		return(
			<Panel {...rest}>
    <Column>
        <Cell>
            <Row>
                <Cell>
                    <CompactRadio />
                </Cell>
                <Cell>
                    <CompactHvac />
                </Cell>
            </Row>
        </Cell>
        <Cell>
            <Row>
                <Cell>
                    <Row align="start center">
                        <AppIconCell icon="compass">Navigation</AppIconCell>
                        <AppIconCell icon="audio" data-tabindex={3} onKeyUp={onTabChange} onClick={onTabChange}>Audio</AppIconCell>
                    </Row>
                    <Row align="start center">
                        <AppIconCell icon="resumeplay">Multimedia</AppIconCell>
                        <AppIconCell icon="gear" data-tabindex={4} onKeyUp={onTabChange} onClick={onTabChange}>Settings</AppIconCell>
                    </Row>
                </Cell>
                <Cell className={css.quadFour}>
                    GPS
                </Cell>
            </Row>
        </Cell>
    </Column>
			</Panel>
		);
	}
});

export default Home;
