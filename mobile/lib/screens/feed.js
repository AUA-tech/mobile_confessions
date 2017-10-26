import React, { PureComponent } from 'react';

import Header from '../components/header';
import TabIcon from '../components/tabicon';

export default class ConfessionsFeedScreen extends PureComponent {
  static navigationOptions = {
    tabBarLabel: 'Feed',
    // Note: By default the icon is only shown on iOS. Search the showIcon option below.
    tabBarIcon: ({ tintColor }) => (
      <TabIcon
        source={require('../assets/chats-icon.png')}
        tintColor={tintColor}
      />
    ),
  };

  render() {
    return (
      <Header title="Feed" />
    );
  }
}
