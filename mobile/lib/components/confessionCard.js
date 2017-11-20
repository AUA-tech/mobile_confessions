import React, { PureComponent } from 'react';
import styled from 'styled-components/native';
import { Text, Image, View, Clipboard, TouchableOpacity } from 'react-native';
import moment from 'moment';

import CommentCard from './commentCard';
import {
  height,
  width,
  COMMENT_PADDING,
  COMMENTER_IMAGE,
  COMMENTER_REPLY_IMAGE,
  MESSAGE_LEFT_PADDING,
  REPLY_LEFT_PADDING
} from '../constants/styles';
import colors from '../constants/colors';
import { linkTo, linkifyMessage, fetchFb } from '../utils';

class ConfessionCard extends PureComponent {

  state = {
    seeMore: false
  }
  selectAndOpenActionSheet = (id) => {
    const { selectPostId, openActionSheet } = this.props;
    selectPostId(id);
    openActionSheet();
  }

  render() {
    const {
      id,
      link,
      message,
      picture,
      full_picture,
      attachments,
      created_time,
      reactions,
      comments,
      show_copied,
      isHidden,
      openReactionsModal
    } = this.props;
      // If image attachment exists, get it's ratio
    const image_height = attachments ? attachments.data[0].media.image.height : undefined;
    const image_width = attachments ? attachments.data[0].media.image.width : undefined;
    const ratio = image_width / image_height;
    const number_of_reactions = reactions ? reactions.data.length : 0;
    const number_of_comments = comments ? comments.data.length : 0;

    const confessionNumberMatch = message.match(/#([0-9]+)\d/); // Match a regexp for extracting confession number
    const confessionNumber = confessionNumberMatch ? confessionNumberMatch[0] : ''; // Match data is an array so we validate and take the first item if valid
    const clearedMessage = confessionNumberMatch ? message.split(confessionNumber)[1]  : message; // We also need to clear the message if the match is not null

    const copyOnLongPress = () => {
      show_copied();
      Clipboard.setString(message);
    }

    const linkifiedMessage = linkifyMessage(clearedMessage);

    const comments_ui = comments &&
    (
      this.state.seeMore ?
      comments.data.map((comment) =>
        <CommentCard
          key={comment.id}
          {...comment}
          openReactionsModal={(id) => openReactionsModal(id)}
        />
      ) :
      <CommentCard
        key={comments.data[0].id}
        {...comments.data[0]}
        openReactionsModal={(id) => openReactionsModal(id)}
      />
    )
    let content = null;
    if(isHidden)
      content = (
        <CardView>
          <TextContentView>
            <RowView>
              <NumberText>{confessionNumber}</NumberText>
              {/* <DateText>{moment(created_time).format('MMM D, HH:mm')}</DateText> */}
              <ActionView onPress={() => this.selectAndOpenActionSheet(id)}>
                <Image
                  style={{width: 15, height: 15, transform: [{rotateZ: '180deg'}], marginTop: 15 }} // this marginTop thing is a hacky way...
                  source={require('../assets/actionSheetButton.png')}
                />
              </ActionView>
            </RowView>
          </TextContentView>
        </CardView>
      )
    else
      content = (
        <CardView>
          <TextContentView>
            <RowView>
              <NumberText>{confessionNumber}</NumberText>
              <DateText>{moment(created_time).format('MMM D, HH:mm')}</DateText>
            </RowView>
            <Text style={{fontFamily: 'Roboto'}} onLongPress={copyOnLongPress}>
              {linkifiedMessage}
            </Text>
          </TextContentView>
          { !full_picture ? null :
            <Image
              style={{width, height: width / ratio}}
              source={{uri: attachments.data[0].media.image.src}}
            />
          }
          <RowView style={{padding: 10}}>
            <RowView>
              <TouchableOpacity style={{paddingHorizontal: 5}} onPress={() => openReactionsModal(id)}>
                <Text style={{fontFamily: 'Roboto'}}>{number_of_reactions} Likes</Text>
              </TouchableOpacity>
              <Text style={{paddingHorizontal: 5, fontFamily: 'Roboto'}}>{number_of_comments} Comment</Text>
            </RowView>
            <ActionView onPress={() => this.selectAndOpenActionSheet(id)}>
              <Image
                style={{width: 15, height: 15}}
                source={require('../assets/actionSheetButton.png')}
              />
            </ActionView>
          </RowView>
          {comments_ui}
          {/* This is ugly af, need to find better solution*/}
          {
            comments_ui &&
            comments.data.length > 1 &&
            (
              this.state.seeMore ?
              <View style={{padding: COMMENT_PADDING}}>
                <TouchableOpacity onPress={() => this.setState({seeMore: false})}>
                  <Text style={{fontFamily: 'Roboto'}}>See Less comments</Text>
                </TouchableOpacity>
              </View> :
              <View style={{padding: COMMENT_PADDING}}>
                <TouchableOpacity onPress={() => this.setState({seeMore: true})}>
                  <Text style={{fontFamily: 'Roboto'}}>See More comments</Text>
                </TouchableOpacity>
              </View>
            )
          }
        </CardView>
      );
    return content;
  }
}

const NumberText = styled.Text`
  color: ${colors.headerColor};
  font-weight: 700;
  font-size: 20;
  font-family: Roboto;
`

const DateText = styled.Text`
  color: ${colors.softTextColor};
  font-weight: 300;
  font-size: 13;
  font-family: Roboto;
`

const RowView = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

const TextContentView = styled.View`
  padding-horizontal: 10;
  padding-vertical: 10;
`
const CardView = styled.View`
  background-color: white;
  margin-bottom: 5;
  padding-bottom: 5;
`

const ActionView = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: 30;
`

export default ConfessionCard;
