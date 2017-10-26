import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Image,
  Button
} from 'react-native';

import Header from '../components/header';

export default class ConfessionsFeedScreen extends PureComponent {
  static navigationOptions = {
    tabBarLabel: 'Feed',
    // Note: By default the icon is only shown on iOS. Search the showIcon option below.
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('../assets/chats-icon.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  render() {
    return (
      <Header title="Feed" />
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26,
  },
});
