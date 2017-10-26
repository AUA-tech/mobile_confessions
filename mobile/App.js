import React from 'react';
import { TabNavigator } from 'react-navigation';

import ConfessionsFeedScreen from './lib/screens/feed';
import NewConfessionScreen from './lib/screens/confession';
import CreditsScreen from './lib/screens/credits';

const screens = {
  Home: {
    screen: ConfessionsFeedScreen,
  },
  Notifications: {
    screen: NewConfessionScreen,
  },
  Credits: {
    screen: CreditsScreen,
  }
};

const options = {
  tabBarPosition: 'bottom',
  animationEnabled: true,
  tabBarOptions: {
    activeTintColor: '#3A4F60',
  },
}

const MyApp = TabNavigator(screens, options);

export default MyApp;
