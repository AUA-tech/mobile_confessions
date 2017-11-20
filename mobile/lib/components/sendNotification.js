import React, { PureComponent } from 'react';
import { Animated } from 'react-native';
import styled from 'styled-components/native';

import { height, width } from '../constants/styles';

const NOTIFICATION_HEIGHT = 40;
const NOTIFICATION_WIDTH = 170;
const notificationStyle = {
	backgroundColor: 'black',
	height: NOTIFICATION_HEIGHT,
	width: NOTIFICATION_WIDTH,
	position: 'absolute',
	left: (width / 2) - (NOTIFICATION_WIDTH / 2),
	top: (height / 4) - 25,
	zIndex: 9999,
	borderRadius: 10,
	justifyContent: 'center',
	alignItems: 'center',
};

export default class SendNotification extends PureComponent {

	notificationOpacity = new Animated.Value(0);
	notificationZindex = new Animated.Value(-500);
	showNotificationF = () => {
		this.notificationZindex = new Animated.Value(500);
		Animated.sequence([
			Animated.timing(this.notificationOpacity, {
				toValue: 1,
				duration: 500,
			}),
			Animated.delay(1500),
			Animated.timing(this.notificationOpacity, {
				toValue: 0,
				duration: 500,
			}),
		]).start(() => {
			this.notificationZindex = new Animated.Value(-500);
			this.props.done();
		});
	}

	render() {
		if (this.props.show_notification) {
			this.showNotificationF();
		}
		const withAnimationsStyle = [
			notificationStyle,
			{
				opacity: this.notificationOpacity,
				zIndex: this.notificationZindex,
			}
		];
		return (
			<Animated.View style={withAnimationsStyle}>
				<NotificationText>
					{this.props.message}
				</NotificationText>
			</Animated.View>
		);
	}
}

const NotificationText = styled.Text`
  color: white;
  font-family: Roboto;
`;
