import React, { PureComponent } from 'react';
import { FlatList, Text } from 'react-native';
import { GraphRequest, GraphRequestManager } from 'react-native-fbsdk';

import Header from '../components/header';
import TabIcon from '../components/tabIcon';
import ConfessionCard from '../components/confessionCard';
import colors from '../constants/colors';

const accessToken = ''; // Paste your key here before using. This is temporary.

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

  constructor() {
    super();
    this.state = {
      confessionsList: []
    }
  }

  responseInfoCallback = (error, result) => {
    if (error) {
      console.log('Error fetching data: ', error);
    } else {
      const { data: confessionsList, paging } = result;
      console.log(confessionsList);
      this.setState({ confessionsList, paging });
    }
  }

  createConfessionCards = ({ item: confession }) => (
    <ConfessionCard {...confession} />
  );

  componentWillMount() {
    const infoRequest = new GraphRequest(
      '/auaindulgence/feed',
      {
        accessToken: accessToken,
        parameters: {
          fields: {
            string: 'id,message,link,created_time',
          }
        }
      },
      this.responseInfoCallback,
    );

    new GraphRequestManager().addRequest(infoRequest).start();
  }

  render() {
    const { confessionsList } = this.state;
    return [
      <Header key='header' title="Feed" />,
      <FlatList
        key='scrollView'
        data={confessionsList}
        style={{backgroundColor: colors.bgColor}}
        renderItem={ this.createConfessionCards }
        keyExtractor={item => item.id}
      />
    ];
  }
}
