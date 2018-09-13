import Divider from '@enact/agate/Divider';
import {Panel} from '@enact/agate/Panels';
import kind from '@enact/core/kind';
import React from 'react';

import css from './Radio.less';

const Radio = kind({
  name: 'Radio',

  styles: {
    css,
    className: 'radio'
  },

  render: (props) => (
    <Panel {...props}>
      <Divider>
        Radio
			</Divider>
    </Panel>
  )
});

export default Radio;