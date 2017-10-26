import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Image,
  Button
} from 'react-native';

import Header from '../components/header';

export default class CreditsScreen extends PureComponent {
  static navigationOptions = {
    tabBarLabel: 'Credits',
    tabBarIcon: ({ tintColor }) => (
      <Image
        source={require('../assets/info-icon.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  };

  render() {
    return (
      <Header title="Credits" />
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26,
  },
});
