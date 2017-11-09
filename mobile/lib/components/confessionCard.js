import React, { PureComponent } from 'react';
import styled from 'styled-components/native';
import { Text, Image, View, Dimensions, Alert, AsyncStorage, Linking, TouchableWithoutFeedback } from 'react-native';
import moment from 'moment';
import linkify from 'linkify-it';

import colors from '../constants/colors';
import { fetch_fb, linkTo } from '../utils';

const linkify_it = linkify();
const {height, width} = Dimensions.get('window');


class CommentCard extends PureComponent {
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
    return (
      <RowView style={{padding: 10}}>
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
            {message}
          </Text>
        </CommentMessageView>
      </RowView>
    )
  }
}

const ConfessionCard = ({
  id,
  link,
  message,
  picture,
  full_picture,
  attachments,
  created_time,
  reactions,
  comments,
  open_action_sheet
}) => {
  // If image attachment exists, get it's ratio
  const image_height = attachments ? attachments.data[0].media.image.height : undefined;
  const image_width = attachments ? attachments.data[0].media.image.width : undefined;
  const ratio = image_width / image_height;
  const number_of_reactions = reactions ? reactions.data.length : 0;
  const number_of_comments = comments ? comments.data.length : 0;

  const confessionNumberMatch = message.match(/#([0-9]+)\d/); // Match a regexp for extracting confession number
  const confessionNumber = confessionNumberMatch ? confessionNumberMatch[0] : ''; // Match data is an array so we validate and take the first item if valid
  const clearedMessage = confessionNumberMatch ? message.split(confessionNumber)[1]  : message; // We also need to clear the message if the match is not null
  // TODO: What if the post has 2 or more links?
  const linkified_arr = linkify_it.match(clearedMessage);
  const updated_arr = linkified_arr && linkified_arr.map((link_obj) => {
    const splitted = clearedMessage.split(link_obj.raw);
    const onPress = () =>
      Linking.canOpenURL(link_obj.url)
      .then(supported => supported && Linking.openURL(link_obj.url));

    return (
      <RowView>
        <Text>{splitted[0]}<Text style={{color: 'blue'}} onPress={onPress}>{link_obj.url}</Text>{splitted[1]}</Text>
      </RowView>
    );
  });

  const comments_ui = !comments ? null : comments.data.map((comment) => {
    return (
      <View>
        <CommentCard {...comment} />
      </View>
    )
  })

  return (
    <CardView>
      <TextContentView>
        <RowView>
          <NumberText>{confessionNumber}</NumberText>
          <DateText>{moment(created_time).format('MMM D, HH:mm')}</DateText>
        </RowView>
        {
          updated_arr ?
          updated_arr[0] :
          <Text>
            {clearedMessage}
          </Text>
        }

      </TextContentView>
      { !full_picture ? null :
        <Image
          style={{width, height: width / ratio}}
          source={{uri: attachments.data[0].media.image.src}}
        />
      }
      <RowView style={{padding: 10}}>
        <RowView>
          <Text style={{paddingHorizontal: 5}}>{number_of_reactions} Likes</Text>
          <Text style={{paddingHorizontal: 5}}>{number_of_comments} Comment</Text>
        </RowView>
        <ActionView onPress={() => open_action_sheet(id)}>
          <Text>=></Text>
        </ActionView>
      </RowView>
      {comments_ui}
    </CardView>
  );
}

const CommenterName = styled.Text`
  color: ${colors.headerColor};
  fontWeight: 700;
  width: ${width * 0.5}
`

const CommentMessageView = styled.View`
  paddingLeft: 10;
  width: ${width - 70};
`

const CommenterImage = styled.Image`
  width: 50;
  height: 50;
  border-radius: 25;
`

const NumberText = styled.Text`
  color: ${colors.headerColor};
  font-weight: 700;
  font-size: 20;
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
  width: 30;
`

export default ConfessionCard;
