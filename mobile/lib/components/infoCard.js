import React from 'react';
import styled from 'styled-components/native';
import { Text, TouchableOpacity, View } from 'react-native';
import moment from 'moment';
import { linkTo } from '../utils';
import colors from '../constants/colors';

const InfoCard = ({
  link,
  name,
  image,
  description,
  open_modal
}) => (
  <CardView onPress={() => open_modal(name)}>
    <RowView>
      <AuthorImage
        source={{uri: image }}
      />
      <ColumnView>
        <RowView style={{width: '100%'}}>
          <AuthorName>{name}</AuthorName>
          <View onPress={() => linkTo(link) }>
              <Icon
                source={require('../assets/info.png')}
              />
          </View>
        </RowView>
        <DescriptionText>{description}</DescriptionText>
      </ColumnView>
    </RowView>
  </CardView>
);

const DescriptionText = styled.Text`
  color: ${colors.primaryColor}
  font-size: 15;
  font-family: Roboto;
`

const AuthorImage = styled.Image`
  height: 80;
  width: 80;
`

const AuthorName = styled.Text`
  color: ${colors.primaryColor};
  font-weight: 700;
  font-size: 20;
  font-family: Roboto;
`

const RowView = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

const ColumnView = styled.View`
  flex: 1;
  padding-left: 10;
`

const CardView = styled.TouchableOpacity`
  padding-horizontal: 20;
  margin-bottom: 20;
`

const Icon = styled.Image`
  width: 22;
  height: 22;
`

export default InfoCard;
