import React, { PureComponent } from 'react';
import styled from 'styled-components/native';
import { Text, View, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import moment from 'moment';

import CommentReplyCard from './commentReplyCard';
import colors from '../constants/colors';
import {
  height,
  width,
  COMMENT_PADDING,
  COMMENTER_IMAGE,
  COMMENTER_REPLY_IMAGE,
  MESSAGE_LEFT_PADDING,
  REPLY_LEFT_PADDING
} from '../constants/styles';
import { fetchFb, linkTo, linkifyMessage } from '../utils';

class CommentCard extends PureComponent {
  state = {
    avatar: 'placeholder',
    link: '',
    seeMore: false
  }
  responseInfoCallback = (error, result) => {
    if (error) {
      console.warn(error);
      return;
    }
    result && result.picture && result.picture.data &&
    this.setState({ avatar: result.picture.data.url, link: result.link });
  }
  async componentWillMount () {
    const {from} = this.props;
    from && await fetchFb(from.id, 'user', this.responseInfoCallback);
  }
  render() {
    const {created_time, message, reactions, from, comments} = this.props;

    const linkifiedMessage = linkifyMessage(message);

    const commentReplies = comments &&
    (
      this.state.seeMore ?
      comments.data.map((comment) => <CommentReplyCard key={comment.id} {...comment} />) :
      <CommentReplyCard key={comments.data[0].id} {...comments.data[0]} />
    )
    return (
      <View style={{padding: COMMENT_PADDING}}>
        <RowView>
          <TouchableWithoutFeedback onPress={() => linkTo(this.state.link)} >
            <CommenterImage
              source={{uri: this.state.avatar}}
            />
          </TouchableWithoutFeedback>
          <CommentMessageView>
            <RowView>
              <CommenterName onPress={() => linkTo(this.state.link)}>
                {from.name}
              </CommenterName>
              <DateText>{moment(created_time).format('MMM D, HH:mm')}</DateText>
            </RowView>
            <Text>
              {linkifiedMessage}
            </Text>
          </CommentMessageView>
        </RowView>
        {commentReplies}
        {/* This is ugly af, need to find better solution*/}
        {
          commentReplies &&
          comments.data.length > 1 &&
          (
            this.state.seeMore ?
            <View style={{padding: COMMENT_PADDING, paddingLeft: REPLY_LEFT_PADDING}}>
              <TouchableOpacity onPress={() => this.setState({seeMore: false})}>
                <Text>See Less replies</Text>
              </TouchableOpacity>
            </View> :
            <View style={{padding: COMMENT_PADDING, paddingLeft: REPLY_LEFT_PADDING}}>
              <TouchableOpacity onPress={() => this.setState({seeMore: true})}>
                <Text>See More replies</Text>
              </TouchableOpacity>
            </View>
          )
        }
      </View>
    )
  }
}

const CommenterImage = styled.Image`
  width: ${COMMENTER_IMAGE};
  height: ${COMMENTER_IMAGE};
  border-radius: ${COMMENTER_IMAGE / 2};
`

const CommenterName = styled.Text`
  color: ${colors.headerColor};
  fontWeight: 700;
  width: ${width * 0.5}
`

const CommentMessageView = styled.View`
  paddingLeft: 10;
  width: ${width - COMMENTER_IMAGE - 2 * COMMENT_PADDING};
`

const DateText = styled.Text`
  color: ${colors.softTextColor};
  font-weight: 300;
  font-size: 13;
`

const RowView = styled.View`
  flex-direction: row;
  justify-content: space-between;
`
export default CommentCard;