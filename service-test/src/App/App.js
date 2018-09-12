import AgateDecorator from '@enact/agate/AgateDecorator';
import {add} from '@enact/core/keymap';

import HVAC from '../views/HVAC';

add('backspace', 8);

const App = AgateDecorator(HVAC);

export default App;
