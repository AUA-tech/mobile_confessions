import React, { PureComponent } from 'react';
import styled from 'styled-components/native';
import { TextInput, Button } from 'react-native';

import Layout from '../components/layout';
import TabIcon from '../components/tabIcon';
import colors from '../constants/colors';

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

  constructor() {
    super();
    this.state = {
      feedback: '',
    }
  }

  onTextChange = feedback => this.setState({ feedback });

  render() {
    return (
      <Layout headerTitle='Confess'>
        <StyledTextInput
          multiline = {true}
          numberOfLines = {4}
          onChangeText={this.onTextChange}
          value={this.state.feedback}
          placeholder={'Confess yourself here'}
          placeholderTextColor={colors.placeholderColor}
        />
        <AttachmentText
          multiline = {true}
          numberOfLines = {4}
          placeholder={'Confess yourself here'}
          placeholderTextColor={colors.placeholderColor}
        />
        <AttachedFilesBox />
        <Button
          onPress={() => { console.log('Pressed') }}
          title='Submit'
          color='green'
          accessibilityLabel='Learn more about this purple button'
        />
      </Layout>
    );
  }
}

const Container = styled.View`
  height: 90%;
  background-color: ${colors.bgColor};
`

const StyledTextInput = styled.TextInput`
  height: 50%;
  width: 100%;
  background-color: white;
  margin-top: 2%;
  padding: 20px;
  font-size: 20;
  margin-bottom: 8%;
`

const AttachmentText = styled.TextInput`
  height: 10%;
  width: 100%;
  background-color: white;
  padding: 20px;
  font-size: 20;
`

const AttachedFilesBox = styled.View`
  height: 25%;
`
