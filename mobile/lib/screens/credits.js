import React, { PureComponent } from 'react';
import styled from 'styled-components/native';

import Layout from '../components/layout';
import TabIcon from '../components/tabIcon';
import Button from '../components/button';
import InfoCard from '../components/infoCard';
import colors from '../constants/colors';
import authors from '../constants/authors';

export default class NewConfessionScreen extends PureComponent {
  static navigationOptions = {
    tabBarLabel: 'Credits',
    tabBarIcon: ({ tintColor }) => (
      <TabIcon
        source={require('../assets/info-icon.png')}
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
          placeholder={'Do you like our app?'}
          placeholderTextColor={colors.placeholderColor}
        />
        <Button
          onPress={() => { console.log('Pressed') }}
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
  background-color: white;
  margin-top: 2%;
  padding: 20px;
  font-size: 20;
`

const AuthorsScrollView = styled.ScrollView`
  flex: 1;
  padding-top: 20;
`
