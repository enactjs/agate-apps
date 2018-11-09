/* eslint no-console: off */
import ROSLIB from 'roslib';
import {cap} from '@enact/core/util';
import {getSimFromLatLong} from './conversion';

function noop () {}

const subscribedTopics = {
	position: {
		name: '/apollo/localization/pose',
		throttle_rate: 500, // eslint-disable-line camelcase
		messageType: 'pb_msgs/LocalizationEstimate'
	},

	// location: {
	// 	name: '/apollo/sensor/gnss/best_pose'
	// 	// messageType: 'pb_msgs/LocalizationEstimate'
	// },

	routingRequest: {
		name: '/apollo/routing_request',
		queue_length: 1, // eslint-disable-line camelcase
		messageType: 'pb_msgs/RoutingRequest'
	},

	routingResponse: {
		name: '/apollo/routing_response',
		messageType: 'pb_msgs/RoutingResponse'
	}

	// detected: {
	// 	name: '/object_classifier/output',
	// 	messageType: 'duckietown_msgs/ClassifiedObject'
	// },
};

function connect ({url, onConnection, onError, onClose, ...topics} = {}) {
	if (!url) throw new Error('roslib url required for usage.');
	const self = {};

	const ros = new ROSLIB.Ros({url});

	ros.on('connection', onConnection || (() => console.log(`ROSLIB: Connected to ${url}`)));
	ros.on('error', onError || (err => console.log(`ROSLIB Error: ${JSON.stringify(err)}`)));
	ros.on('close', onClose || (() => console.log(`ROSLIB: Connection closed to ${url}`)));

	// To see the topic generator:
	// cat /usr/lib/python3.5/site-packages/object_classifier/object_classification.py

	// Subscribing to a Topic
	for (const topicTitle in subscribedTopics) {
		const topicHandle = new ROSLIB.Topic({
			ros,
			...subscribedTopics[topicTitle]
		});

		const handlerName = ('on' + cap(topicTitle));
		// console.log('Setting up:', handlerName, 'for', topicTitle, 'with', subscribedTopics[topicTitle]);
		topicHandle.subscribe(topics[handlerName] || noop);
		self[topicTitle] = topicHandle;
	}

	//
	// Methods
	//

	self.reconnect = () => {
		if (!ros.isConnected) {
			ros.connect(url);
		}
	};

	self.send = (topic, message) => {
		let payload = null;

		// Setup a space where we can augment or simplify convoluted ROS API message format by
		// intercepting distributing properties into the right place, then sending that along for
		// processing.
		switch (topic) {
			case 'routingRequest': {
				if (message instanceof Array) {
					// Example of the payload:
					//
					// payload = {
					// 	waypoint : [
					// 		{ // current position
					// 			pose: {x: current.x, y: current.y}
					// 		},
					// 		{ // destination
					// 			pose: {x: dest.x,  y: dest.y}
					// 		}
					// 	]
					// };
					const waypoint = [];
					message.forEach(coords => {
						waypoint.push({pose: getSimFromLatLong(coords)}); // this is the opposite of the information that needs to go into here...
					});
					payload = {waypoint};
				} else {
					payload = message;
				}
				break;
			}
			default:
				payload = message;
		}

		console.log('sending', topic, payload);
		if (payload) {
			const msg = new ROSLIB.Message(payload);
			self[topic].publish(msg);
		}
	};

	self.ros = ros;
	return self;
}

export default connect;
