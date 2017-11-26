import React, { PureComponent } from 'react';
import { Keyboard, Text, TouchableOpacity, Alert } from 'react-native';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';

import Layout from '../components/layout';
import TabIcon from '../components/tabIcon';
import Button from '../components/button';
import InfoCard from '../components/infoCard';
import SendNotification from '../components/sendNotification';
import colors from '../constants/colors';
import authors from '../constants/authors';
import { width } from '../constants/styles';
import { awsPost, linkTo } from '../utils';

export default class NewConfessionScreen extends PureComponent {
	static navigationOptions = {
		tabBarLabel: 'Credits',
		tabBarIcon: ({ tintColor }) => (
			<TabIcon
				source={require('../assets/credits-icon.png')}
				tintColor={tintColor}
			/>
		),
	};

	constructor() {
		super();
		this.state = {
			feedback: '',
			showNotification: false,
			message: '',
			modalVisible: false,
			authorName: '',
		};
	}

  onTextChange = feedback => this.setState({ feedback });

	sendFeedback = async () => {
		const { feedback } = this.state;
		Keyboard.dismiss();
		if (feedback.trim() !== '') {
			this.setState({ feedback: '', showNotification: true, message: 'Feedback Submitted' });
			const fetchedRes = await awsPost('send_feedback', { feedback: `FEEDBACK: ${feedback}` });
			const res = await fetchedRes.json();
			if (res.message !== 'Success') {
				Alert.alert('Oops, feedback was not submitted');
			}
		}
	}

	render() {
		const { feedback } = this.state;
		const authorsCards = authors.map(author => (
			<InfoCard
				openModal={name => this.setState({ modalVisible: true, authorName: name })}
				{...author}
				key={author.name}
			/>
		));
		const filteredAuthor = authors.filter(a => a.name === this.state.authorName)[0];
		const selectedAuthor = filteredAuthor || {};
		const authorLinks = !selectedAuthor ? null :
			[ 'facebook', 'linkedin', 'github', 'behance' ].map((source) => {
				if (selectedAuthor[source]) {
					return (
						<TouchableOpacity key={source} onPress={() => linkTo(selectedAuthor[source])}>
							<LogoImage source={{ uri: source }} />
						</TouchableOpacity>
					);
				}
				return null;
			});
		return (
			<Layout headerTitle='Credits'>
				<Modal
					style={{ alignItems: 'center', justifyContent: 'center' }}
					isVisible={this.state.modalVisible}
					avoidKeyboard
					onBackdropPress={() => this.setState({ modalVisible: false })}
				>
					<ModalView>
						<RowView>
							<AuthorImage
								source={{ uri: selectedAuthor.image }}
							/>
							<AuthorModalView>
								<AuthorModalName>{selectedAuthor.name}</AuthorModalName>
								<AuthorModalDescription>{selectedAuthor.description}</AuthorModalDescription>
							</AuthorModalView>
						</RowView>
						<AuthorModalFullDescriptionView>
							<Text style={{ fontFamily: 'Roboto' }}>{selectedAuthor.fullDescription}</Text>
						</AuthorModalFullDescriptionView>
						<RowView>
							{authorLinks}
						</RowView>
					</ModalView>
				</Modal>
				<SendNotification
					showNotification={this.state.showNotification}
					done={() => this.setState({ showNotification: false })}
					message={this.state.message}
				/>
				<StyledTextInput
					multiline
					numberOfLines={4}
					onChangeText={this.onTextChange}
					value={this.state.feedback}
					placeholder='Do you like our app?'
					placeholderTextColor={colors.placeholderColor}
				/>
				<Button
					disabled={!feedback.trim()}
					onPress={this.sendFeedback}
					title='Send Feedback'
				/>
				<AuthorsScrollView>
					{authorsCards}
				</AuthorsScrollView>
			</Layout>
		);
	}
}

const AuthorModalView = styled.View`
  padding-horizontal: 20;
  width: ${0.6 * width};
`;

const AuthorModalName = styled.Text`
  color: ${colors.headerColor};
  font-weight: 700;
  font-size: 16;
  font-family: Roboto;
`;

const AuthorModalDescription = styled.Text`
  font-size: 14;
  margin-top: 5;
  font-family: Roboto;
`;

const AuthorModalFullDescriptionView = styled.View`
	height: ${width / 3};
	padding-top: 20;
	padding-bottom: 10;
`;

const RowView = styled.View`
  flex-direction: row;
`;

const AuthorImage = styled.Image`
  height: 80;
  width: 80;
`;

const LogoImage = styled.Image`
  height: 70;
  width: 70;
  margin-right: 20;
`;

const ModalView = styled.View`
  height: ${0.9 * width};
  width: ${0.9 * width};
  background-color: white;
  border-radius: 10;
  padding: 30px;
`;

const StyledTextInput = styled.TextInput`
  height: 25%;
  width: 100%;
  min-height: 100;
  background-color: white;
  margin-top: 2%;
  padding: 20px;
  font-size: 20;
  font-family: Roboto;
`;

const AuthorsScrollView = styled.ScrollView`
  flex: 1;
  padding-top: 20;
`;
