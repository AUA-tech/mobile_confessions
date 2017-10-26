import React, { PureComponent } from 'react';

import Header from '../components/header';
import TabIcon from '../components/tabicon';

export default class CreditsScreen extends PureComponent {
  static navigationOptions = {
    tabBarLabel: 'Credits',
    tabBarIcon: ({ tintColor }) => (
      <TabIcon
        source={require('../assets/info-icon.png')}
        tintColor={tintColor}
      />
    ),
  };

  render() {
    return (
      <Header title="Credits" />
    );
  }
}
