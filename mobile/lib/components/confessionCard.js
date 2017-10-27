import React, { PureComponent } from 'react';
import styled from 'styled-components/native';
import { Text, View } from 'react-native';
import moment from 'moment';

import colors from '../constants/colors';

const ConfessionCard = ({ message, created_time }) => {
  const confessionNumberMatch = message.match(/#([0-9]+)\d/); // Match a regexp for extracting confession number
  const confessionNumber = confessionNumberMatch ? confessionNumberMatch[0] : ''; // Match data is an array so we validate and take the first item if valid
  const clearedMessage = confessionNumberMatch ? message.split(confessionNumber)[1]  : message; // We also need to clear the message if the match is not null
  return (
    <CardView>
      <NumberText>{confessionNumber}</NumberText>
      <Text>{moment(created_time).format('MMMM Do YYYY, HH:MM')}</Text>
      <Text>{clearedMessage}</Text>
    </CardView>
  );
}

const NumberText = styled.Text`
  color: ${colors.headerColor};
  font-weight: 700;
  font-size: 20;
`

const CardView = styled.View`
  padding-horizontal: 10;
  padding-vertical: 10;
  background-color: white;
  margin-bottom: 5;
`

export default ConfessionCard;
