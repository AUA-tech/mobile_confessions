import React from 'react';
import styled from 'styled-components/native';
import { Text } from 'react-native';
import moment from 'moment';

import colors from '../constants/colors';

const InfoCard = ({
  link,
  name,
  image,
  description,
}) => (
  <CardView>
    <RowView>
      <AuthorImage
        source={{uri: image }}
      />
      <ColumnView>
        <RowView style={{width: '100%'}}>
          <AuthorName>{name}</AuthorName>
          <Text>Icon</Text>
        </RowView>
        <DescriptionText>{description}</DescriptionText>
      </ColumnView>
    </RowView>
  </CardView>
);

const DescriptionText = styled.Text`
  color: ${colors.primaryColor}
  font-size: 15;
`

const AuthorImage = styled.Image`
  height: 80;
  width: 80;
`

const AuthorName = styled.Text`
  color: ${colors.primaryColor};
  font-weight: 700;
  font-size: 20;
`

const RowView = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

const ColumnView = styled.View`
  flex: 1;
  padding-left: 10;
`

const CardView = styled.View`
  padding-horizontal: 20;
  margin-bottom: 20;
`

export default InfoCard;
