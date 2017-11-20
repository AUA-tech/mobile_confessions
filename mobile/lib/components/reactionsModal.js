import React, { PureComponent } from 'react';
import { View, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';

import colors from '../constants/colors';
import { width } from '../constants/styles';

export default class ReactionsModal extends PureComponent {
  
  render(){

    const {
      modalVisible,
      closeModal
    } = this.props;
    
    return(
      <Modal
        style={{ alignItems: 'center', justifyContent: 'flex-end', marginBottom: 0 }}
        isVisible={modalVisible}
        avoidKeyboard
        onBackdropPress={closeModal}
      >
        <ReactionsWrapper>
          <ReactionsTopBar />
          <ReactionsScrollView>
            
          </ReactionsScrollView>
        </ReactionsWrapper>
      </Modal>
    );
  }
}

const ReactionsScrollView = styled.ScrollView`
  background-color: white;
  height: 400;
  width: ${width};
  border-top-right-radius: 20;
  border-top-left-radius: 20;
`;

const ReactionsTopBar = styled.View`
  height: 8;
  width: 70;
  border-radius: 4;
  margin-bottom: 10;
  background-color: white;
`;

const ReactionsWrapper = styled.View`
  height: 420;
  width: ${width};
  justify-content: center;
  align-items: center;
`