/* eslint no-console: off */
import ROSLIB from 'roslib';
import {cap} from '@enact/core/util';

function noop () {}

const subscribedTopics = {
	localization: {
		name: '/apollo/localization/pose',
		messageType: 'pb_msgs/LocalizationEstimate'
	},

	routingRequest: {
		name: '/apollo/routing_request',
		queue_length: 1, // eslint-disable-line camelcase
		messageType: 'pb_msgs/RoutingRequest'
	}


	// detected: {
	// 	name: '/object_classifier/output',
	// 	messageType: 'duckietown_msgs/ClassifiedObject'
	// },
	// detectedAll: {
	// 	name: '/object_classifier/output_all',
	// 	messageType: 'duckietown_msgs/ClassifiedObject'
	// },
	// joystick: {
	// 	name: '/joy',
	// 	messageType: 'sensor_msgs/Joy'
	// },
	// wheelsCmd: {
	// 	name: '/wheels_cmd',
	// 	messageType: 'duckietown_msgs/WheelsCmdStamped'
	// },
	// carCmd: {
	// 	name: '/sensor/car_cmd',
	// 	messageType: 'duckietown_msgs/Twist2DStamped'
	// },
	// ultrasound: {
	// 	name: '/sensor/ultrasound',
	// 	messageType: 'sensor_msgs/Range'
	// },
	// infrared: {
	// 	name: '/sensor/infrared',
	// 	messageType: 'sensor_msgs/Range'
	// },
	// obstacle: {
	// 	name: '/obstacle',
	// 	messageType: 'duckietown_msgs/BoolStamped'
	// }
};

function connect ({url, onConnection, onError, onClose, ...topics} = {}) {
	if (!url) throw new Error('roslib url required for usage.');

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
	}

	return {ros};
}

export default connect;
