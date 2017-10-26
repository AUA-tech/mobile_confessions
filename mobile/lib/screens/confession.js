import React, { PureComponent } from 'react';
import {
  StatusBar,
  StyleSheet,
  Image,
  Button,
  View
} from 'react-native';

import Header from '../components/header';

export default class NewConfessionScreen extends PureComponent {
  static navigationOptions = {
    tabBarLabel: 'Confess',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('../assets/notif-icon.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  render() {
    return (
      <Header title="Confess" />
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26,
  },
});
