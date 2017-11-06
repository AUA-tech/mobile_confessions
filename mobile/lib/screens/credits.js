import React, { PureComponent } from 'react';
import { Keyboard } from 'react-native';
import styled from 'styled-components/native';

import Layout from '../components/layout';
import TabIcon from '../components/tabIcon';
import Button from '../components/button';
import InfoCard from '../components/infoCard';
import SendNotification from '../components/sendNotification';
import colors from '../constants/colors';
import authors from '../constants/authors';
import { awsPost } from '../utils';

export default class NewConfessionScreen extends PureComponent {
  static navigationOptions = {
    tabBarLabel: 'Credits',
    tabBarIcon: ({ tintColor }) => (
      <TabIcon
        source={require('../assets/credits-icon.png')}
        tintColor={tintColor}
      />
    ),
  };

  constructor() {
    super();
    this.state = {
      feedback: '',
      show_notification: false,
      message: ''
    }
  }

  onTextChange = feedback => this.setState({ feedback });

  sendFeedback = async () => {
    const { feedback } = this.state;
    Keyboard.dismiss();
    if(feedback.trim() !== '') {
      const fetched_res = await awsPost('send_feedback', { feedback });
      const res = await fetched_res.json();

      if(res.message === "Success") {
        this.setState({ feedback: '', show_notification: true, message: 'Feedback Submitted' })
      } else {
        this.setState({ feedback: '', show_notification: true, message: 'Oops, something wrong' })
      }
    }
  }

  render() {
    const { feedback } = this.state;
    return (
      <Layout headerTitle='Credits'>
        <SendNotification
          show_notification={ this.state.show_notification }
          done={ () => this.setState({ show_notification: false }) }
          message={this.state.message}
        />
        <StyledTextInput
          multiline
          numberOfLines = {4}
          onChangeText={this.onTextChange}
          value={this.state.feedback}
          placeholder={'Do you like our app?'}
          placeholderTextColor={colors.placeholderColor}
        />
        <Button
          disabled={!feedback.trim()}
          onPress={this.sendFeedback}
          title='Send Feedback'
        />
        <AuthorsScrollView>
          { authors.map(author => <InfoCard {...author} key={author.name} />)}
        </AuthorsScrollView>
      </Layout>
    );
  }
}

const StyledTextInput = styled.TextInput`
  height: 25%;
  width: 100%;
  min-height: 100;
  background-color: white;
  margin-top: 2%;
  padding: 20px;
  font-size: 20;
`

const AuthorsScrollView = styled.ScrollView`
  flex: 1;
  padding-top: 20;
`
