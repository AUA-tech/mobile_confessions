import React, { PureComponent } from 'react';
import { Keyboard } from 'react-native';
import styled from 'styled-components/native';

import Layout from '../components/layout';
import TabIcon from '../components/tabIcon';
import Button from '../components/button';
import SendNotification from '../components/sendNotification';

import colors from '../constants/colors';

import { awsPost } from '../utils';

export default class NewConfessionScreen extends PureComponent {
	static navigationOptions = {
		tabBarLabel: 'Confess',
		tabBarIcon: ({ tintColor }) => (
			<TabIcon
				source={require('../assets/confess-icon.png')}
				tintColor={tintColor}
			/>
		),
	};

	constructor() {
		super();
		this.state = {
			confession: '',
			showNotification: false,
			message: '',
		};
	}

  onTextChange = confession => this.setState({ confession });

	sendConfession = async () => {
		const { confession } = this.state;
		if (confession.trim() !== '') {
			const fetchedRes = await awsPost('send_confession', { confession });
			const res = await fetchedRes.json();

			if (res.message === 'Success') {
				this.setState({ confession: '', showNotification: true, message: 'Confession Submitted' });
			} else {
				this.setState({ confession: '', showNotification: true, message: 'Oops, something wrong' });
			}
		}
	}

	render() {
		const { confession } = this.state;
		return (
			<Layout headerTitle='Confess'>
				<KeyboardDismisser activeOpacity={1} onPress={() => Keyboard.dismiss()}>
					<SendNotification
						showNotification={this.state.showNotification}
						done={() => this.setState({ showNotification: false })}
						message={this.state.message}
					/>
					<StyledTextInput
						multiline
						numberOfLines={4}
						onChangeText={this.onTextChange}
						value={this.state.confession}
						placeholder='Confess yourself here'
						placeholderTextColor={colors.placeholderColor}
					/>
					<AttachmentContainer>
						<AttachmentText
							editable={false}
							multiline
							numberOfLines={4}
							placeholder='This will be changed later'
							placeholderTextColor={colors.placeholderColor}
						/>
						<AttachedFilesBox />
					</AttachmentContainer>
					<Button
						disabled={!confession.trim()}
						onPress={this.sendConfession}
						title='Submit'
					/>
				</KeyboardDismisser>
			</Layout>
		);
	}
}

const KeyboardDismisser = styled.TouchableOpacity`
  height: 100%;
`;

const StyledTextInput = styled.TextInput`
  flex: 1;
  height: 50%;
  width: 100%;
  background-color: white;
  margin-top: 2%;
  padding: 20px;
  font-size: 20;
  margin-bottom: 8%;
  font-family: Roboto;
`;

const AttachmentContainer = styled.View`
  flex: 1;
`;

const AttachmentText = styled.TextInput`
  height: 33%;
  width: 100%;
  background-color: white;
  padding: 20px;
  font-size: 20;
  font-family: Roboto;
`;

const AttachedFilesBox = styled.View`
  height: 66%;
`;
