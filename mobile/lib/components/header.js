import React, { PureComponent } from 'react';
import styled from 'styled-components/native';
import { StatusBar, NetInfo, View } from 'react-native';

import colors from '../constants/colors';

class Header extends PureComponent {
	state = {
		isConnected: true,
	}

	componentDidMount() {
		const handleFirstConnectivityChange = (reach) => {
			switch (reach.type) {
			case 'none':
			case 'unknown':
				this.setState({ isConnected: false });
				break;
			case 'wifi':
			case 'cellular':
				this.setState({ isConnected: true });
				break;
			default:
				break;
			}
		};
		NetInfo.addEventListener(
			'connectionChange',
			handleFirstConnectivityChange,
		);
	}

	componentWillUnmount() {
		NetInfo.removeEventListener('connectionChange');
	}

	render() {
		const { title } = this.props;
		const { isConnected } = this.state;

		return (
			<CenteredView style={{ backgroundColor: isConnected ? colors.primaryColor : colors.warningColor }}>
				<StatusBar
					backgroundColor={isConnected ? colors.primaryColor : colors.warningColor}
					barStyle="light-content"
				/>
				<HeaderText>{title}</HeaderText>
				{
					isConnected ?
						null :
						<View>
							<NoInternetConnectionText>
								no internet connection
							</NoInternetConnectionText>
						</View>
				}
			</CenteredView>
		);
	}
}

const CenteredView = styled.View`
  align-items: center;
  justify-content: center;
  height: 10%;
  min-height: 50;
`;

const HeaderText = styled.Text`
  color: white;
  font-size: 22;
  font-weight: 700;
  padding-top: 15;
  font-family: Roboto;
`;

const NoInternetConnectionText = styled.Text`
  color: white;
  font-size: 10;
  opacity: 0.8;
  font-family: Roboto;
`;

export default Header;
