import React from 'react';
import { Platform, AsyncStorage } from 'react-native';
import { TabNavigator } from 'react-navigation';

import colors from './lib/constants/colors';
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

const options = Platform.select({
  ios: {
    tabBarPosition: 'bottom',
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: colors.primaryColor,
    },
  },
  android: {
    tabBarPosition: 'bottom',
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: colors.primaryColor,
      inactiveTintColor: colors.inactiveTintColor,
      pressColor: colors.primaryColor,
      showIcon: true,
      tabStyle: {
        backgroundColor: 'white',
        height: 60,
      },
      style: {
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#D6D6D6'
      },
      iconStyle: {
        marginTop: 10,
      }
    },
  }
})

const MyApp = TabNavigator(screens, options);
MyApp.prototype.componentDidMount = function () {
  AsyncStorage.getItem('hided_posts', (err, res) => {
    if(err) {
      console.warn('AsyncStorage error', err);
      return;
    }
    if(res === null)
      AsyncStorage.setItem('hided_posts', JSON.stringify([]));
  })
}

export default MyApp;
