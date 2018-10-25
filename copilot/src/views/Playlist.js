import Button from '@enact/agate/Button';
import {Cell, Row} from '@enact/ui/Layout';
import {adaptEvent, forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import Item from '@enact/agate/Item';
import React from 'react';
import VirtualList from '@enact/ui/VirtualList';

const forwardDelete = adaptEvent(
	(ev, {id}) => {
		return {id};
	},
	forward('onDelete')
);

const forwardPlay = adaptEvent(
	(ev, {url}) => {
		return {url};
	},
	forward('onPlay')
);

const PlaylistItem = kind({
	name: 'PlaylistItem',
	handlers: {
		onDelete: handle(forwardDelete),
		onPlay: handle(forwardPlay)
	},
	render: ({onDelete, onPlay, ...rest}) => {
		const item = rest;
		return (
			<Row {...rest}>
				<Cell
					component={Button}
					icon="closex"
					id={item.id}
					onClick={onDelete}
					shrink
					small
				/>
				<Cell
					component={Item}
					style={{color:'white'}}
					onClick={onPlay}
				>
					{item.title}
				</Cell>
			</Row>
		);
	}
});

const PlaylistBase = kind({
	name: 'Playlist',
	computed: {
		renderItem: ({itemList, onDelete, onPlay}) => ({index, ...rest}) => {
			const item = itemList[index];
			const props = {
				onDelete,
				onPlay,
				...item,
				...rest
			};
			return (
				<PlaylistItem {...props} />
			);
		}
	},
	render: ({itemList, renderItem, ...rest}) => {
		delete rest.onPlay;
		return (
			<VirtualList
				dataSize={itemList.length}
				itemRenderer={renderItem}
				itemSize={72}
				{...rest}
			/>
		);
	}
});

export default PlaylistBase;
export {PlaylistBase as Playlist, PlaylistBase};
