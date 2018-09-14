import Button from '@enact/agate/Button';
import ToggleButton from '@enact/agate/ToggleButton';
import Divider from '@enact/agate/Divider';
import {Panel} from '@enact/agate/Panels';
import kind from '@enact/core/kind';
import React from 'react';
import Marquee from '@enact/ui/Marquee';
import SlotItem from '@enact/ui/SlotItem';
import {LabeledItemBase} from '@enact/agate/LabeledItem';
import IconItem from '@enact/agate/IconItem';
import Item from '@enact/agate/Item';
import css from './Radio.less';


const RadioBase = kind({
  name: 'Radio',

  styles: {
    css,
    className: 'radio'
  },

  render: (props) => (
    <Panel {...props}>
      <div className={css.container}>
        <div className={css.top}>
          <div className={css.toggleContainer}>                  
            <ToggleButton css={{bg: css.radioToggle}} small type="grid">AM</ToggleButton> |
            <ToggleButton css={{bg: css.radioToggle}} selected small type="grid">FM</ToggleButton>
          </div>
          <div className={css.titleContainer}>
            {/*Radio TextInfo*/}
            <Marquee>93.1 MHZ</Marquee>
            <Marquee>Artist - Song</Marquee>            
            {/*Tune*/}
          </div>
          <div className={css.buttonContainer}>                                
            <Button icon={"arrowsmallleft"} />
            Tune
            <Button icon={"arrowsmallright"} />


            {/*Scan*/}
            <Button icon={"arrowsmallleft"} />
            Scan
            <Button icon={"arrowsmallright"} />
          </div>
        </div>      
        {/*List*/}
        <div className={css.bottom}>
          <PresetItem icon="plus">93.1 MHZ FM</PresetItem>
          <PresetItem icon="plus">105.1 MHZ FM</PresetItem>
          <PresetItem icon="plus">88.1 MHZ FM</PresetItem>
          <PresetItem icon="plus">92.1 MHZ FM</PresetItem>
          <PresetItem icon="plus">120.1 MHZ FM</PresetItem>      
        </div>
      </div>
    </Panel>
  )
});

const PresetItem = kind({
	name: 'PresetItem',

	propTypes:{},

	styles: {
		css,
		className: 'presetItem'
	},

	render: ({children, css, disabled, icon, label, titleIcon, ...rest}) => (
    <div style={{display: 'flex', 'justifyContent': 'space-between', 'font-size': '1rem'}} {...rest}>
      <div>
        {children}
      </div>
      <Button className={css.icon} icon="plus" />
    </div>
	)
});

export default RadioBase;