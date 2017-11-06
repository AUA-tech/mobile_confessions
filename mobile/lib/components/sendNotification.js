import React, { PureComponent } from 'react';
import { Text, Animated } from 'react-native';
import styled from 'styled-components/native';

import { height, width } from '../constants/styles';

export default class SendNotification extends PureComponent {

  code_copied_opacity = new Animated.Value(0);
  show_code_copied = () => {
    Animated.sequence([
      Animated.timing(this.code_copied_opacity, {
        toValue: 1,
        duration: 500
      }),
      Animated.delay(1500),
      Animated.timing(this.code_copied_opacity, {
        toValue: 0,
        duration: 500
      })
    ]).start(() => {
      this.props.done()
    })
  }

  render() {
    if(this.props.show_notification) {
      this.show_code_copied();
    }
    return(
      <Animated.View style={[notificationStyle, {opacity: this.code_copied_opacity}]}>
        <NotificationText>
          {this.props.message}
        </NotificationText>
      </Animated.View>
    )
  }
}

const NotificationText = styled.Text`
  color: white;
`

const notificationStyle = {
  backgroundColor: 'black',
  height: 50,
  width: 200,
  position: 'absolute',
  left: (width / 2) - 100,
  top: height / 4 - 25,
  zIndex: 9999,
  borderRadius: 10,
  justifyContent: 'center',
  alignItems: 'center'
}