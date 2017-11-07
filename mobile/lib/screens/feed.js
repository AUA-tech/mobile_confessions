import React, { PureComponent } from 'react';
import { FlatList, AsyncStorage, ActivityIndicator, View, Text, TextInput, Alert } from 'react-native';
import { differenceBy } from 'lodash';
import { GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import Modal from 'react-native-modal';
import ActionSheet from 'react-native-actionsheet'

import Layout from '../components/layout';
import TabIcon from '../components/tabIcon';
import ConfessionCard from '../components/confessionCard';
import colors from '../constants/colors';
import {height, width} from '../constants/styles';
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
      hided_posts: [],
      modalVisible: false,
      actionsheet_selected_id: ''
    }
  }
  async componentDidMount(){
    const hided_posts_str = await AsyncStorage.getItem('hided_posts');
    const hided_posts = JSON.parse(hided_posts_str);
    this.setState({hided_posts: hided_posts ? hided_posts : []});
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
    <ConfessionCard
      {...confession}
      open_action_sheet={(id) => {
        this.setState({actionsheet_selected_id: id})
        this.ActionSheet.show()
      }}
    />
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
            string: 'id,message,link,created_time,attachments,picture,full_picture,reactions,comments',
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
  handle_action_sheet (index) {
      switch (index) {
        case 0:
          console.warn('Close ActionSheet');
          break;
        case 1:
          Alert.alert(`Hide this post?`, '', [
            {text: 'No', onPress: null, style: 'cancel'},
            {text: 'Yes', onPress: async () => {
              const hided_posts_str = await AsyncStorage.getItem('hided_posts');
              const hided_posts = JSON.parse(hided_posts_str);

              this.setState({hided_posts: [...this.state.hided_posts, this.state.actionsheet_selected_id]})

              hided_posts.push(this.state.actionsheet_selected_id);
              const updated_hided_posts_str = JSON.stringify(hided_posts);
              AsyncStorage.setItem('hided_posts', updated_hided_posts_str);
            }}
          ]);
          break;
        case 2:
          this.setState({modalVisible: true});
          break;
        default:
          break;
      }
    }
  render() {
    const { confessionsList, accessToken, fetchStatus } = this.state;
    const filteredConfessionList = confessionsList.filter((post) => {
      return !this.state.hided_posts.includes(post.id);
    })
    return (
      <Layout headerTitle='Feed'>
        <Modal
          style={{alignItems: 'center', justifyContent: 'center'}}
          isVisible={this.state.modalVisible}
          avoidKeyboard
          onBackdropPress={() => this.setState({modalVisible: false})}
        >
          <View style={{height: width / 1.5, width: width / 1.5, backgroundColor: 'white'}}>
            <Text>What's wrong with this post {this.state.actionsheet_selected_id}? Send report to AUA tech support!</Text>
            <TextInput
              style={{
                height: '50%',
                width: '100%',
                fontSize: 20
              }}
              multiline
              numberOfLines = {4}
              onChangeText={this.onTextChange}
              value={this.state.confession}
              placeholder={'Write your report'}
              placeholderTextColor={colors.placeholderColor}
            />
          </View>
        </Modal>
        <FlatList
          key='scrollView'
          data={filteredConfessionList}
          style={{backgroundColor: colors.bgColor}}
          renderItem={ this.createConfessionCards }
          keyExtractor={item => item.id}
          refreshing={fetchStatus === 2}
          onRefresh={() => this.generateGraphRequest(accessToken)}
          onEndReachedThreshold={0.2}
          onEndReached={() => this.fetchMore(accessToken)}
        />
        { fetchStatus !== 1 ? null :
          <ActivityIndicator />
        }
        <ActionSheet
          ref={o => this.ActionSheet = o}
          options={['Cancel', 'Hide', 'Report']}
          cancelButtonIndex={0}
          destructiveButtonIndex={2}
          onPress={(i) => this.handle_action_sheet(i)}
        />
      </Layout>
    );
  }
}
