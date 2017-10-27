import React, { PureComponent } from 'react';

import Header from '../components/header';
import TabIcon from '../components/tabIcon';

export default class NewConfessionScreen extends PureComponent {
  static navigationOptions = {
    tabBarLabel: 'Confess',
    tabBarIcon: ({ tintColor }) => (
      <TabIcon
        source={require('../assets/notif-icon.png')}
        tintColor={tintColor}
      />
    ),
  };

  render() {
    return (
      <Header title="Confess" />
    );
  }
}
