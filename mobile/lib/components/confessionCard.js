import React from 'react';
import styled from 'styled-components/native';
import { Text, Image } from 'react-native';
import moment from 'moment';

import colors from '../constants/colors';

const ConfessionCard = ({
  link,
  message,
  picture,
  full_picture,
  attachments,
  created_time
}) => {
  const confessionNumberMatch = message.match(/#([0-9]+)\d/); // Match a regexp for extracting confession number
  const confessionNumber = confessionNumberMatch ? confessionNumberMatch[0] : ''; // Match data is an array so we validate and take the first item if valid
  const clearedMessage = confessionNumberMatch ? message.split(confessionNumber)[1]  : message; // We also need to clear the message if the match is not null
  return (
    <CardView>
      <RowView>
        <NumberText>{confessionNumber}</NumberText>
        <DateText>{moment(created_time).format('MMMM Do YYYY, HH:MM')}</DateText>
      </RowView>
      <Text>{clearedMessage}</Text>
      { !full_picture ? null :
        <Image
          style={{width: '100%', height: 250}}
          source={{uri: full_picture}}
        />
      }
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

const CardView = styled.View`
  padding-horizontal: 10;
  padding-vertical: 10;
  background-color: white;
  margin-bottom: 5;
`

export default ConfessionCard;
