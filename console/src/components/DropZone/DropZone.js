// import kind from '@enact/core/kind';
import hoc from '@enact/core/hoc';
// import {Layout, Cell} from '@enact/ui/Layout';
// import Slottable from '@enact/ui/Slottable';
import PropTypes from 'prop-types';
import {setDisplayName} from 'recompose';
import React from 'react';

// https://stackoverflow.com/questions/9907419/how-to-get-a-key-in-a-javascript-object-by-its-value
// ZER0 - Mar 28 '12 at 12:51
const getKeyByValue = (obj, value) =>
	Object.keys(obj).find(key => obj[key] === value);

const DropZone = hoc((configHoc, Wrapped) => {
	return class extends React.Component {
		static displayName = 'DropZone';

		static propTypes = {
			arrangement: PropTypes.object
		};

		state = {
			arrangement: this.props.arrangement || {},
			// index: this.props.index,
			dragging: null
		};

		// constructor (props) {
		// 	super(props);
		// 	this.state = {
		// 		showPopup: false,
		// 	};
		// }

		// onColorChangeAccent = ({value}) => {
		// 	this.setState({colorAccent: value});
		// };

		handleDragOver = (ev) => {
			ev.preventDefault();
			// Set the dropEffect to move
			ev.dataTransfer.dropEffect = 'move';
		};

		handleDrop = (ev) => {
			ev.preventDefault();

			// Get the id of the target and add the moved element to the target's DOM
			// const origSlot = ev.dataTransfer.getData('text/plain');
			const origSlot = this.dragOriginNode.dataset.slot;

			let dragDropNode;
			if (ev.target.dataset.slot) {
				dragDropNode = ev.target;
			} else {
				const closestSlot = ev.target.closest('[data-slot]');
				if (closestSlot && closestSlot.dataset.slot) {
					dragDropNode = closestSlot;
				} else {
					return;
				}
			}
			// Get the destination element's slot value, or find its ancestor that has one (in case we drop this on a child or grandchild of the slotted item).
			// const destSlot = ev.target.dataset.slot || (ev.target.closest('[data-slot]') && ev.target.closest('[data-slot]').dataset.slot);
			const destSlot = dragDropNode.dataset.slot;

			if (destSlot === origSlot) return;

			// console.dir(ev.target);
			// ev.dataTransfer.clearData();

			this.dragOriginNode.dataset.slot = destSlot;
			dragDropNode.dataset.slot = origSlot;

			console.log('from:', origSlot, 'to:', destSlot);
			// console.log(this.dragOriginNode.text)

			this.dragOriginNode = null;
			this.setState(({arrangement}) => {
				const previousOrigin = getKeyByValue(arrangement, origSlot) || origSlot;
				const previousDestination = getKeyByValue(arrangement, destSlot) || destSlot;

				// debugger;
				arrangement[previousDestination] = previousOrigin;
				arrangement[previousOrigin] = previousDestination;
				return {dragging: null, arrangement};
			});
		};

		// handleDragEnd = () => {
		// 	this.setState({dragging: null});
		// };

		handleDragStart = (ev) => {
			// ev.dataTransfer.setData('text/plain', ev.target.dataset.slot);
			ev.dataTransfer.effectAllowed = 'move';
			this.dragOriginNode = ev.target;
			this.setState({dragging: true});
		};

		// drop = (ev) => {
		//     if (ev.target.id) {
		//       this.props.swap(ev.dataTransfer.getData("text"), ev.target.id)
		//       ev.dataTransfer.clearData()
		//     }
		//   }

		// setNode = (node) => {
		// 	this.node = ReactDOM.findDOMNode(node); // eslint-disable-line react/no-find-dom-node
		// };
		//
		//
		//
		//
		//
		// SOMEONE needs to remember what the current state of remapping is and use those values as
		// the origin slot names
		//
		//
		//
		//
		//

		render () {
			const props = {...this.props};
			console.log('DropZone arrangement:', this.state.arrangement);

			return (
				<Wrapped
					{...props}
					// style={{
						// backgroundColor: (this.state.dragging ? 'red': 'transparent'),
						// pointerEvents: (this.state.dragging ? 'none': null)
					// }}
					// ref={this.setNode}
					// showPopup={this.state.showPopup}
					arrangement={this.state.arrangement}
					// draggable="true"
					onDragOver={this.handleDragOver}
					onDrop={this.handleDrop}
					// onDragEnd={this.handleDragEnd}
					onDragStart={this.handleDragStart}
				/>
			);
		}
	};
});

// const Draggable = hoc(({props: configProps}, Wrapped) => props => <Wrapped {...props} {...configProps} />)
const Draggable = (Wrapped) => setDisplayName('Draggable')((props) => <Wrapped {...props} draggable="true" />);

// const Draggable = hoc((configHoc, Wrapped) => {
// 	return class extends React.Component {
// 		static displayName = 'Draggable';
// 		render () {
// 			return (
// 				<Wrapped
// 					draggable="true"
// 					{...this.props}
// 				/>
// 			);
// 		}
// 	};
// });

export default DropZone;
export {
	DropZone,
	Draggable
}
