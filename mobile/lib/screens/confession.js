import React, { PureComponent } from 'react';
import styled from 'styled-components/native';

import Layout from '../components/layout';
import TabIcon from '../components/tabIcon';
import Button from '../components/button';
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
      confession: '',
    }
  }

  onTextChange = confession => this.setState({ confession });

  render() {
    return (
      <Layout headerTitle='Confess'>
        <StyledTextInput
          multiline = {true}
          numberOfLines = {4}
          onChangeText={this.onTextChange}
          value={this.state.confession}
          placeholder={'Confess yourself here'}
          placeholderTextColor={colors.placeholderColor}
        />
        <AttachmentContainer>
          <AttachmentText
            multiline = {true}
            numberOfLines = {4}
            placeholder={'Confess yourself here'}
            placeholderTextColor={colors.placeholderColor}
          />
          <AttachedFilesBox />
        </AttachmentContainer>
        <Button
          onPress={() => { console.log('Pressed') }}
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
