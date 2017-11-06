import React, { PureComponent } from 'react';
import { Text, Animated } from 'react-native';
import styled from 'styled-components/native';

import Layout from '../components/layout';
import TabIcon from '../components/tabIcon';
import Button from '../components/button';
import SendNotification from '../components/sendNotification';

import colors from '../constants/colors';

import { awsPost } from '../utils';

export default class NewConfessionScreen extends PureComponent {
  static navigationOptions = {
    tabBarLabel: 'Confess',
    tabBarIcon: ({ tintColor }) => (
      <TabIcon
        source={require('../assets/confess-icon.png')}
        tintColor={tintColor}
      />
    ),
  };

  constructor() {
    super();
    this.state = {
      confession: '',
      show_notification: false
    }
  }

  onTextChange = confession => this.setState({ confession });

  sendConfession = () => {
    const { confession } = this.state;
    this.setState({confession: '', show_notification: true})
    awsPost('send_confession', { confession });
  }

  render() {
    return (
      <Layout headerTitle='Confess'>
        <SendNotification
          show_notification={ this.state.show_notification }
          done={ () => this.setState({show_notification: false}) }
          message="Confession Submitted"
        />
        <StyledTextInput
          multiline
          numberOfLines = {4}
          onChangeText={this.onTextChange}
          value={this.state.confession}
          placeholder={'Confess yourself here'}
          placeholderTextColor={colors.placeholderColor}
        />
        <AttachmentContainer>
          <AttachmentText
            multiline
            numberOfLines = {4}
            placeholder={'This will be changed later'}
            placeholderTextColor={colors.placeholderColor}
          />
          <AttachedFilesBox />
        </AttachmentContainer>
        <Button
          onPress={this.sendConfession}
          title='Submit'
        />
      </Layout>
    );
  }
}

const StyledTextInput = styled.TextInput`
  flex: 1;
  height: 50%;
  width: 100%;
  background-color: white;
  margin-top: 2%;
  padding: 20px;
  font-size: 20;
  margin-bottom: 8%;
`

const AttachmentContainer = styled.View`
  flex: 1;
`

const AttachmentText = styled.TextInput`
  height: 33%;
  width: 100%;
  background-color: white;
  padding: 20px;
  font-size: 20;
`

const AttachedFilesBox = styled.View`
  height: 66%;
`
