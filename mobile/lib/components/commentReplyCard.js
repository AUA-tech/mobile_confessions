import React, { PureComponent } from 'react';
import styled from 'styled-components/native';
import { Text, Alert, TouchableWithoutFeedback } from 'react-native';
import moment from 'moment';

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
import { fetch_fb, linkTo, linkifyMessage } from '../utils';

class CommentReplyCard extends PureComponent {
  state = {
    avatar: 'placeholder',
    link: ''
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
    from && await fetch_fb(from.id, 'user', this.responseInfoCallback);
  }
  render() {
    const {created_time, message, reactions, from} = this.props;

    const linkifiedMessage = linkifyMessage(message);

    return (
      <RowView style={{padding: COMMENT_PADDING, paddingLeft: REPLY_LEFT_PADDING}}>
        <TouchableWithoutFeedback onPress={() => linkTo(this.state.link)} >
          <CommenterReplyImage
            source={{uri: this.state.avatar}}
          />
        </TouchableWithoutFeedback>
        <CommentReplyMessageView>
          <RowView>
            <CommenterReplyName onPress={() => linkTo(this.state.link)}>
              {from.name}
            </CommenterReplyName>
            <DateText>{moment(created_time).format('MMM D, HH:mm')}</DateText>
          </RowView>
          <Text>
            {linkifiedMessage}
          </Text>
        </CommentReplyMessageView>
      </RowView>
    )
  }
}

const CommenterReplyImage = styled.Image`
  width: ${COMMENTER_REPLY_IMAGE};
  height: ${COMMENTER_REPLY_IMAGE};
  border-radius: ${COMMENTER_REPLY_IMAGE / 2};
`

const CommenterReplyName = styled.Text`
  color: ${colors.headerColor};
  fontWeight: 700;
  width: ${width * 0.3}
`

const CommentReplyMessageView = styled.View`
  paddingLeft: 10;
  width: ${width - REPLY_LEFT_PADDING - COMMENTER_REPLY_IMAGE - 2 * COMMENT_PADDING};
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
export default CommentReplyCard;