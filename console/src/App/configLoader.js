/**
 * Load config values from the URL's query-string, then load the config file in the app root.
 *
 * Values are referenced in the following order:
 *    query-string -> localStorage -> config file
 */

import {getConfig} from '../../../components/urlParser';
import configFile from '../../config';

const config = getConfig(configFile);

export default config;
