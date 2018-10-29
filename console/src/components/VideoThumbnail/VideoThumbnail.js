import IconItem from '@enact/agate/IconItem';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

import css from './VideoThumbnail.less';
console.log(css)
const VideoThumbnail = kind({
	name: 'VideoThumbnail',

	propTypes: {
		onSelect: PropTypes.func,
		video: PropTypes.object
	},

	styles: {
		css,
		className: 'video-thumbnail',
		publicClassNames: ['video-thumbnail', 'name']
	},

	handlers: {
		onSelect: (ev, {onSelect, video}) => {
			if (onSelect) {
				onSelect({
					type: 'onSelect',
					video
				});
			}
		}
	},

	render: ({video, onSelect, ...props}) => (
		<div
			{...props}
			className={css.thumbnails}
			onClick={onSelect({
				type: 'youtube',
				title: video.snippet.title,
				url: `https://www.youtube.com/embed/${video.id}?autoplay=1`,
				thumbnail: video.snippet.thumbnails.medium.url
			})}
		>
			<img src={video.snippet.thumbnails.medium.url} />
			<span className={css.caption}>{video.snippet.title}</span>
		</div>
	)
});

export default VideoThumbnail;
