import React, { PureComponent } from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import Modal from 'react-native-modal';
import nodeEmoji from 'node-emoji';
import styled from 'styled-components/native';
import { width } from '../constants/styles';
import colors from '../constants/colors';
import { linkTo } from '../utils';

export default class ReactionsModal extends PureComponent {
	getEmoji = (reactionType) => {
		switch (reactionType) {
		case 'LOVE':
			return nodeEmoji.get('heart');
		case 'WOW':
			return nodeEmoji.get('open_mouth');
		case 'LIKE':
			return nodeEmoji.get('thumbsup');
		case 'HAHA':
			return nodeEmoji.get('joy');
		case 'ANGRY':
			return nodeEmoji.get('rage');
		case 'SAD':
			return nodeEmoji.get('cry');
		default:
			return 'OOPS';
		}
	}

	render() {
		const {
			modalVisible,
			closeModal,
			data,
		} = this.props;

		const reactionCards = !data ? null : data.map(reactionObj => (
			<RowView key={reactionObj.id} style={{ marginBottom: 20 }}>
				<RowView style={{ justifyContent: 'center', alignItems: 'center' }}>
					<TouchableWithoutFeedback onPress={() => linkTo(reactionObj.link)} >
						<ReactorImage
							source={{ uri: reactionObj.pic }}
						/>
					</TouchableWithoutFeedback>
					<ReactorName style={{ paddingLeft: 20 }} onPress={() => linkTo(reactionObj.link)}>
						{reactionObj.name}
					</ReactorName>
				</RowView>
				<View style={{ justifyContent: 'center', alignItems: 'center', paddingRight: 20 }}>
					<Text style={{ fontSize: 40, fontFamily: 'Roboto' }}>
						{this.getEmoji(reactionObj.type)}
					</Text>
				</View>
			</RowView>
		));

		return (
			<Modal
				style={{ alignItems: 'center', justifyContent: 'flex-end', marginBottom: 0 }}
				isVisible={modalVisible}
				avoidKeyboard
				onBackdropPress={closeModal}
				useNativeDriver
			>
				<ReactionsWrapper>
					<ReactionsTopBar />
					<ReactionsScrollView>
						{reactionCards}
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
  padding: 10px;
`;

const ReactionsTopBar = styled.View`
  height: 6;
  width: 70;
  border-radius: 3;
  margin-bottom: 10;
  background-color: white;
`;

const ReactionsWrapper = styled.View`
  height: 470;
  width: ${width};
  justify-content: center;
  align-items: center;
`;

const ReactorImage = styled.Image`
  width: 50;
  height: 50;
  border-radius: 25;
`;

const ReactorName = styled.Text`
  color: ${colors.headerColor};
  fontWeight: 700;
  width: ${width * 0.5}
  font-family: Roboto;
`;

const RowView = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
