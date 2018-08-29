// Agate Environment

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import AgateDecorator from '@enact/agate/AgateDecorator';
import {Panels, Panel, Header} from '@enact/moonstone/Panels';

import css from './AgateEnvironment.less';

const reloadPage = () => {
	const {protocol, host, pathname} = window.parent.location;
	window.parent.location.href = protocol + '//' + host + pathname;
};

const PanelsBase = kind({
	name: 'AgateEnvironment',

	propTypes: {
		description: PropTypes.string,
		title: PropTypes.string
	},

	render: ({children, title, description, ...rest}) => (
		<div {...rest}>
			<Panels onApplicationClose={reloadPage}>
				<Panel className={css.panel}>
					<Header type="compact" title={title} casing="preserve" />
					{description ? (
						<div className={css.description}>
							<p>{description}</p>
						</div>
					) : null}
					{children}
				</Panel>
			</Panels>
		</div>
	)
});

const FullscreenBase = kind({
	name: 'AgateEnvironment',

	render: (props) => (
		<div {...props} />
	)
});

const Agate = AgateDecorator({overlay: false}, PanelsBase);
const AgateFullscreen = AgateDecorator({overlay: false}, FullscreenBase);

const StorybookDecorator = (story, config) => {
	const sample = story();
	return (
		<Agate
			title={`${config.kind} ${config.story}`.trim()}
			description={config.description}
		>
			{sample}
		</Agate>
	);
};

const FullscreenStorybookDecorator = (story, config) => {
	const sample = story();
	return (
		<AgateFullscreen
			title={`${config.kind} ${config.story}`.trim()}
			description={config.description}
		>
			{sample}
		</AgateFullscreen>
	);
};

export default StorybookDecorator;
export {StorybookDecorator as Agate, FullscreenStorybookDecorator as AgateFullscreen};
