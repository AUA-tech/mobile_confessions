import React from 'react';
import styled from 'styled-components/native';

import colors from '../constants/colors';

const Button = ({ onPress, title, disabled }) => (
<CustomTouchableOpacity disabled={disabled} onPress={onPress}>
      <ButtonWrapper
        style={{ backgroundColor: disabled ? colors.placeholderColor : colors.sucessColor }}
        disabled={disabled}>
        <ButtonTitle>{ title.toUpperCase() }</ButtonTitle>
      </ButtonWrapper>
    </CustomTouchableOpacity>
);

const CustomTouchableOpacity = styled.TouchableOpacity`
  height: 10%;
  min-height: 50;
`;

const ButtonWrapper = styled.View`
  flex: 1;
  height: 100%;
  justify-content: center;
  align-items: center;
  padding-vertical: 20;
`;

const ButtonTitle = styled.Text`
  color: white;
  font-weight: 700;
  font-size: 20;
  font-family: Roboto;
`;

export default Button;
