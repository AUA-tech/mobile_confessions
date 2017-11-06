import React from 'react';
import styled from 'styled-components/native';

import colors from '../constants/colors';

const Button = ({ onPress, title, disabled }) => (
  <CustomTouchableOpacity disabled={disabled} onPress={onPress}>
    <ButtonWrapper disabled={disabled}>
      <ButtonTitle>{ title.toUpperCase() }</ButtonTitle>
    </ButtonWrapper>
  </CustomTouchableOpacity>
)

const CustomTouchableOpacity = styled.TouchableOpacity`
  height: 10%;
  min-height: 50;
`

const ButtonWrapper = styled.View`
  flex: 1;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.disabled ? colors.placeholderColor : colors.sucessColor};
  padding-vertical: 20;
`
const ButtonTitle = styled.Text`
  color: white;
  font-weight: 700;
  font-size: 20;
`

export default Button;
