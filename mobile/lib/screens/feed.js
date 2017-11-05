import React, { PureComponent } from 'react';
import { FlatList, AsyncStorage, ActivityIndicator } from 'react-native';
import { differenceBy } from 'lodash';
import { GraphRequest, GraphRequestManager } from 'react-native-fbsdk';

import Layout from '../components/layout';
import TabIcon from '../components/tabIcon';
import ConfessionCard from '../components/confessionCard';
import colors from '../constants/colors';
import { awsGet } from '../utils';

export default class ConfessionsFeedScreen extends PureComponent {
  static navigationOptions = {
    tabBarLabel: 'Feed',
    // Note: By default the icon is only shown on iOS. Search the showIcon option below.
    tabBarIcon: ({ tintColor }) => (
      <TabIcon
        source={require('../assets/feed-icon.png')}
        tintColor={tintColor}
      />
    ),
  };

  constructor() {
    super();
    this.state = {
      confessionsList: [],
      accessToken: '',
      fetchStatus: 1,
    }
  }

  responseInfoCallback = (error, result) => {
    if (error) {
      console.log('Error fetching data: ', error);
      this.setState({ fetchStatus: 0 }); // May later change to 4, which will mean error: not needed yet
    } else {
      const { confessionsList } = this.state;
      const { data, paging } = result;
      const newPostsList = differenceBy(data, confessionsList, 'id');
      const newList = [ ...newPostsList, ...confessionsList ];
      // status 0 means nothing to load
      this.setState({ confessionsList: newList, paging, fetchStatus: 0 });
    }
  }

  createConfessionCards = ({ item: confession }) => (
    <ConfessionCard {...confession} />
  );

  generateGraphRequest = accessToken => {
    this.setState({ fetchStatus: 1 }); // loading
    const infoRequest = new GraphRequest(
      '/auaindulgence/feed',
      {
        parameters: {
          access_token: {
            string: accessToken
          },
          fields: {
            string: 'id,message,link,created_time,attachments,picture,full_picture',
          }
        }
      },
      this.responseInfoCallback,
    );

    new GraphRequestManager().addRequest(infoRequest).start();
  }

  fetchMore = async accessToken => {
    const { paging, confessionsList } = this.state;
    this.setState({ fetchStatus: 1 }); // loading
    try {
      const promise = await fetch(paging.next);
      const result = await promise.json();
      const { data, paging: newPaging } = result;
      const newPostsList = differenceBy(data, confessionsList, 'id');
      const newList = [ ...confessionsList, ...newPostsList ];
      this.setState({ confessionsList: newList, paging: newPaging, fetchStatus: 0 });
    } catch (error) {
      console.log(error);
    }
  }

  async componentWillMount() {
    try {
      const { accessToken } = this.state;
      this.generateGraphRequest(accessToken);
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { confessionsList, accessToken, fetchStatus } = this.state;
    return (
      <Layout headerTitle='Feed'>
        <FlatList
          key='scrollView'
          data={confessionsList}
          style={{backgroundColor: colors.bgColor}}
          renderItem={ this.createConfessionCards }
          keyExtractor={item => item.id}
          refreshing={fetchStatus === 2}
          onRefresh={() => this.generateGraphRequest(accessToken)}
          onEndReachedThreshold={0.0}
          onEndReached={() => this.fetchMore(accessToken)}
        />
        { fetchStatus !== 1 ? null :
          <ActivityIndicator />
        }
      </Layout>
    );
  }
}
