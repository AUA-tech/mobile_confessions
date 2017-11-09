import React, { PureComponent } from 'react';
import { FlatList, AsyncStorage, ActivityIndicator, View, Text, TextInput, Alert } from 'react-native';
import { differenceBy } from 'lodash';
import { GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import Modal from 'react-native-modal';
import ActionSheet from 'react-native-actionsheet'

import Layout from '../components/layout';
import TabIcon from '../components/tabIcon';
import ConfessionCard from '../components/confessionCard';
import SendNotification from '../components/sendNotification';
import colors from '../constants/colors';
import {height, width} from '../constants/styles';
import { awsGet, fetch_fb, fetch_next } from '../utils';

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
      fetchStatus: 1,
      hided_posts: [],
      modalVisible: false,
      actionsheet_selected_id: '',
      show_notification: false
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
      show_copied={() => this.setState({show_notification: true})}
      open_action_sheet={(id) => {
        this.setState({actionsheet_selected_id: id})
        this.ActionSheet.show()
      }}
    />
  );

  generateGraphRequest = () => {
    this.setState({ fetchStatus: 1 }); // loading
    fetch_fb('/auaindulgence/feed', 'posts', this.responseInfoCallback);
  }

  fetchMore = async () => {
    const { paging, confessionsList } = this.state;
    this.setState({ fetchStatus: 1 }); // loading
    const {newList, newPaging} = await fetch_next(paging.next, confessionsList);
    this.setState({ confessionsList: newList, paging: newPaging, fetchStatus: 0 });
  }

  componentWillMount() {
    try {
      this.generateGraphRequest();
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
    const { confessionsList, fetchStatus } = this.state;
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
        <SendNotification
          show_notification={ this.state.show_notification }
          done={ () => this.setState({ show_notification: false }) }
          message="Confession Copied"
        />
        <FlatList
          key='scrollView'
          data={filteredConfessionList}
          style={{backgroundColor: colors.bgColor}}
          renderItem={ this.createConfessionCards }
          keyExtractor={item => item.id}
          refreshing={fetchStatus === 2}
          onRefresh={() => this.generateGraphRequest()}
          onEndReachedThreshold={0.2}
          onEndReached={() => this.fetchMore()}
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
