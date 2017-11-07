import React, { PureComponent } from 'react';
import { Keyboard, Text, TouchableOpacity, Linking } from 'react-native';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';

import Layout from '../components/layout';
import TabIcon from '../components/tabIcon';
import Button from '../components/button';
import InfoCard from '../components/infoCard';
import SendNotification from '../components/sendNotification';
import colors from '../constants/colors';
import authors from '../constants/authors';
import {height, width} from '../constants/styles';
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
      message: '',
      modalVisible: false,
      author_name: ''
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
    const authors_cards = authors.map(author =>
      <InfoCard
        open_modal={(name) => this.setState({modalVisible: true, author_name: name})}
        {...author}
        key={author.name}
      />
    )
    const filtered_author = authors.filter((a) => a.name === this.state.author_name)[0];
    const selected_author = filtered_author ? filtered_author : {};
    const author_links = !selected_author ? null :
      ['facebook', 'linkedin', 'github', 'behance'].map((source) =>
        !selected_author[source] ? null :
          <TouchableOpacity key={source} onPress={ () =>
            Linking.openURL(selected_author[source])
            .catch(err => console.warn('An error occurred', err))
          }>
            <LogoImage source={{uri: source}} />
          </TouchableOpacity>
      )
    return (
      <Layout headerTitle='Credits'>
        <Modal
          style={{alignItems: 'center', justifyContent: 'center'}}
          isVisible={this.state.modalVisible}
          avoidKeyboard
          onBackdropPress={() => this.setState({modalVisible: false})}
        >
          <ModalView>
            <RowView>
              <AuthorImage
                source={{uri: selected_author.image }}
              />
              <AuthorModalView>
                <AuthorModalName>{selected_author.name}</AuthorModalName>
                <AuthorModalDescription>{selected_author.description}</AuthorModalDescription>
              </AuthorModalView>
            </RowView>
            <AuthorModalFullDescriptionView>
              <Text>{selected_author.full_description}</Text>
            </AuthorModalFullDescriptionView>
            <RowView>
              {author_links}
            </RowView>
          </ModalView>
        </Modal>
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
          {authors_cards}
        </AuthorsScrollView>
      </Layout>
    );
  }
}

const AuthorModalView = styled.View`
  padding-horizontal: 20;
  width: ${0.6 * width};
`
const AuthorModalName = styled.Text`
  color: ${colors.headerColor};
  font-weight: 700;
  font-size: 16;
`

const AuthorModalDescription = styled.Text`
  font-size: 14;
  margin-top: 5;
`

const AuthorModalFullDescriptionView = styled.View`
  height: ${width / 3};
  padding-vertical: 10;
`

const RowView = styled.View`
  flex-direction: row;
`

const AuthorImage = styled.Image`
  height: 80;
  width: 80;
`

const LogoImage = styled.Image`
  height: 70;
  width: 70;
  margin-right: 10;
`

const ModalView = styled.View`
  height: ${0.9 * width};
  width: ${0.9 * width};
  background-color: white;
  border-radius: 10;
  padding: 30px;
`

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
