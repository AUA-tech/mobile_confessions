import React, { PureComponent } from 'react';
import styled from 'styled-components/native';
import { StatusBar, NetInfo, View, Text } from 'react-native';

import colors from '../constants/colors';

class Header extends PureComponent {

  state = {
    is_connected: true,
    which_connection: 'wifi'
  }

  componentDidMount() {
    const handleFirstConnectivityChange = (reach) => {
      switch (reach.type) {
        case 'none':
        case 'unknown':
          this.setState({ which_connection: reach, is_connected: false })
          break;
        case 'wifi':
        case 'cellular':
          this.setState({ which_connection: reach, is_connected: true })
          break;
      }
    }
    NetInfo.addEventListener(
      'connectionChange',
      handleFirstConnectivityChange
    );
  }

  componentWillUnmount() {
    NetInfo.removeEventListener(
      'connectionChange'
    )
  }

  render() {
    const { title } = this.props;
    const { is_connected } = this.state;

    return(
      <CenteredView style={{backgroundColor: is_connected ? colors.primaryColor : colors.noInternetColor }}>
        <StatusBar
          backgroundColor={ is_connected ? colors.primaryColor : colors.noInternetColor }
          barStyle="light-content"
        />
        <HeaderText>{title}</HeaderText>
        {
          is_connected ? null :
          <View>
            <NoInternetConnectionText>
              no internet connection
            </NoInternetConnectionText>
          </View>
        }
      </CenteredView>
    )
  }

}

const CenteredView = styled.View`
  align-items: center;
  justify-content: center;
  height: 10%;
  min-height: 50;
`

const HeaderText = styled.Text`
  color: white;
  font-size: 22;
  font-weight: 700;
  padding-top: 15;
  font-family: Roboto;
`

const NoInternetConnectionText = styled.Text`
  color: white;
  font-size: 10;
  opacity: 0.8;
  font-family: Roboto;
`

export default Header;
