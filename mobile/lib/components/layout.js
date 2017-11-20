import React from 'react';
import styled from 'styled-components/native';

import Header from './header';
import colors from '../constants/colors';

const Layout = ({ headerTitle, children }) => [
	<Header title={headerTitle} key='title' />,
	<Container key='textInput'>
		{children}
	</Container>,
];

const Container = styled.View`
  flex: 1;
  height: 90%;
  background-color: ${colors.bgColor};
`;

export default Layout;
