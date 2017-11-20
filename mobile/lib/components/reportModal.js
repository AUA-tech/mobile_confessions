import React, { PureComponent } from 'react';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';

import colors from '../constants/colors';
import { width } from '../constants/styles';

export default class ReportModal extends PureComponent {
  
  render(){
    const {
      modalVisible,
      reportText,
      onReportTextChange,
      closeModal,
      submitReport
    } = this.props;
    return(
      <Modal
        style={{ alignItems: 'center', justifyContent: 'center' }}
        isVisible={modalVisible}
        avoidKeyboard
        onBackdropPress={closeModal}
      >
        <ReportView>
          <ReportCancelButtonView>
            <ReportCancelButton onPress={closeModal}>
              <ReportCancelButtonText>
                X
              </ReportCancelButtonText>
            </ReportCancelButton>
          </ReportCancelButtonView>
          <ReportTextInput
            multiline
            numberOfLines={4}
            onChangeText={onReportTextChange}
            value={reportText}
            placeholder="What is the reason you report this confession?"
            placeholderTextColor={colors.placeholderColor}
          />
          <ReportButton onPress={() => submitReport()}>
            <ReportButtonText>
              Report
            </ReportButtonText>
          </ReportButton>
        </ReportView>
      </Modal>
    );
  }
}


const ReportCancelButtonView = styled.View`
  justify-content: flex-end;
  flex-direction: row;
  padding: 5px;
`;

const ReportCancelButton = styled.TouchableOpacity`
  height: 30;
  width: 30;
  justify-content: center;
  align-items: center;
`;

const ReportCancelButtonText = styled.Text`
  font-size: 23;
  opacity: 0.7;
`;

const ReportTextInput = styled.TextInput`
  height: 210;
  width: 100%;
  fontSize: 20;
  padding: 20px;
`;

const ReportButton = styled.TouchableOpacity`
  height: 50;
  width: 100%;
  align-items: center;
  justify-content: center;
  background-color: ${colors.noInternetColor};
  border-bottom-left-radius: 10;
  border-bottom-right-radius: 10;
`;

const ReportButtonText = styled.Text`
  fontSize: 20;
  color: white;
`;

const ReportView = styled.View`
  height: 300;
  width: ${0.9 * width};
  background-color: white;
  border-radius: 10;
`;
