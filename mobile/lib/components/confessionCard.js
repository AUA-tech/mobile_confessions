import React from 'react';
import styled from 'styled-components/native';
import { Text, Image, View, Dimensions, Alert, AsyncStorage, Linking } from 'react-native';
import moment from 'moment';
import linkify from 'linkify-it';
const linkify_it = linkify();
import colors from '../constants/colors';
const {height, width} = Dimensions.get('window');

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

  return (
    <CardView>
      <TextContentView>
        <RowView>
          <NumberText>{confessionNumber}</NumberText>
          <DateText>{moment(created_time).format('MMM D, HH:MM')}</DateText>
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
    </CardView>
  );
}


const NumberText = styled.Text`
  color: ${colors.headerColor};
  font-weight: 700;
  font-size: 20;
`

const DateText = styled.Text`
  color: ${colors.softTextColor};
  font-weight: 300;
  font-size: 16;
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
