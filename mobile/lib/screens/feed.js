import React, { PureComponent } from 'react';
import { FlatList, AsyncStorage, ActivityIndicator, View, Text, TextInput, Alert } from 'react-native';
import { differenceBy } from 'lodash';
import Modal from 'react-native-modal';
import ActionSheet from 'react-native-actionsheet';
import { NavigationActions } from 'react-navigation';
import styled from 'styled-components/native';

import Layout from '../components/layout';
import TabIcon from '../components/tabIcon';
import ConfessionCard from '../components/confessionCard';
import SendNotification from '../components/sendNotification';
import colors from '../constants/colors';
import { width } from '../constants/styles';
import { fetchFb, fetchNext, awsPost } from '../utils';

export default class ConfessionsFeedScreen extends PureComponent {
	static navigationOptions = ({ navigation }) => ({
		tabBarLabel: 'Feed',
		// Note: By default the icon is only shown on iOS. Search the showIcon option below.
		tabBarIcon: ({ tintColor }) => (
			<TabIcon
				source={require('../assets/feed-icon.png')}
				tintColor={tintColor}
			/>
		),
		tabBarOnPress: ({ focused }, jumpToIndex) => {
			if (focused) {
				const paramsAction = NavigationActions.navigate({
					routeName: 'Home',
					params: { refresh: true },
				});
				navigation.dispatch(paramsAction);
			} else {
				jumpToIndex(0);
			}
		},
	});

	constructor() {
		super();
		this.state = {
			confessionsList: [],
			fetchStatus: 1,
			hiddenPosts: [],
			modalVisible: false,
			actionSheetSelectedId: '',
			show_notification: false,
			reportText: ''
		};
	}

	componentWillMount() {
		try {
			this.generateGraphRequest();
		} catch (error) {
			console.log(error);
		}
	}

	async componentDidMount() {
		const hiddenPostsJson = await AsyncStorage.getItem('hiddenPosts');
		const hiddenPosts = JSON.parse(hiddenPostsJson) || [];
		this.setState({ hiddenPosts });
	}

	responseInfoCallback = (error, result) => {
		if (error) {
			AsyncStorage.getItem('cachedPosts')
			.then((cachedPostsJson) => {
				const cachedPosts = JSON.parse(cachedPostsJson) || [];
				this.setState({ fetchStatus: 0, confessionsList: cachedPosts });
			})
			console.log('Error fetching data: ', error);
			// May later change to 4, which will mean error: not needed yet
		} else {
			const { confessionsList } = this.state;
			const { data, paging } = result;
			const newPostsList = differenceBy(data, confessionsList, 'id');
			const newList = [ ...newPostsList, ...confessionsList ];
			// status 0 means nothing to load
			this.setState({ confessionsList: newList, paging, fetchStatus: 0 }, () => {
				const updatedCachedPosts = JSON.stringify(newList.slice(0, 25));
				AsyncStorage.setItem('cachedPosts', updatedCachedPosts);
			});
		}
	}

	createConfessionCards = ({ item: confession }) => (
		<ConfessionCard
			{...confession}
			isHidden={this.state.hiddenPosts.includes(confession.id)}
			show_copied={() => this.setState({ show_notification: true, notificationMessage: "Confession Copied" })}
			open_action_sheet={(id) => {
				this.setState({ actionSheetSelectedId: id });
				this.ActionSheet.show();
			}}
		/>
	);

	generateGraphRequest = () => {
		this.setState({ fetchStatus: 1 }); // loading
		fetchFb('/auaindulgence/feed', 'posts', this.responseInfoCallback);
	}

	fetchMore = async () => {
		const { paging, confessionsList } = this.state;
		this.setState({ fetchStatus: 1 }); // loading
		const { newList, newPaging } = await fetchNext(paging.next, confessionsList);
		this.setState({ confessionsList: newList, paging: newPaging, fetchStatus: 0 });
	}

	handleActionSheet(index) {
		const { hiddenPosts: statePosts, actionSheetSelectedId } = this.state;
		const isHidden = statePosts.includes(actionSheetSelectedId);
		const alertMessage = isHidden ? 'Unhide this post?' : 'Hide this post?';
		switch (index) {
		case 0:
			console.warn('Close ActionSheet');
			break;
		case 1:
			Alert.alert( alertMessage, '', [
				{ text: 'No', onPress: null, style: 'cancel' },
				{
					text: 'Yes',
					onPress: async () => {
						let hiddenPosts = [];
						if(isHidden) {
							hiddenPosts = statePosts.filter((id) => id !== actionSheetSelectedId);
						} else {
							hiddenPosts = [ ...statePosts, actionSheetSelectedId ];
						}
						this.setState({ hiddenPosts }, () => {
							const updatedhiddenPostJson = JSON.stringify(hiddenPosts);
							AsyncStorage.setItem('hiddenPosts', updatedhiddenPostJson);
						});
					},
				},
			]);
			break;
		case 2:
			this.setState({ modalVisible: true });
			break;
		default:
			break;
		}
	}

	async submitReport() {
		const { reportText, actionSheetSelectedId, confessionsList } = this.state;
		if(reportText.trim()){

			const actionSheetSelectedObj = confessionsList.filter((conf) => conf.id === actionSheetSelectedId)[0];
			const actionSheetSelectedMsg = actionSheetSelectedObj && actionSheetSelectedObj.message;

			const feedback = `REPORT: ${reportText} Message: ${actionSheetSelectedMsg}`;
			const fetched_res = await awsPost('send_feedback', { feedback });
			const res = await fetched_res.json();

			if(res.message === "Success") {
				this.setState({
					reportText: '',
					show_notification: true,
					notificationMessage: 'Report Submitted',
					modalVisible: false
				})
			} else {
				this.setState({
					reportText: '',
					show_notification: true,
					notificationMessage: 'Oops, something wrong',
					modalVisible: false
				})
			}

		}
	}

	render() {
		const {
			confession,
			fetchStatus,
			hiddenPosts,
			modalVisible,
			confessionsList,
			actionSheetSelectedId,
			show_notification,
			reportText,
			notificationMessage
		} = this.state;
		const actionSheetButtonArray = [
			'Cancel',
			hiddenPosts.includes(actionSheetSelectedId) ? 'Unhide' : 'Hide',
			'Report'
		];

		return (
			<Layout headerTitle="Feed">
				<Modal
					style={{ alignItems: 'center', justifyContent: 'center' }}
					isVisible={modalVisible}
					avoidKeyboard
					onBackdropPress={() => this.setState({ modalVisible: false })}
				>
					<ReportView>
						<ReportCancelButtonView>
							<ReportCancelButton onPress={() => this.setState({ modalVisible: false })}>
								<ReportCancelButtonText>
									X
								</ReportCancelButtonText>
							</ReportCancelButton>
						</ReportCancelButtonView>
						<ReportTextInput
							multiline
							numberOfLines={4}
							onChangeText={(reportText) => this.setState({reportText})}
							value={reportText}
							placeholder="What is the reason you report this confession?"
							placeholderTextColor={colors.placeholderColor}
						/>
						<ReportButton onPress={() => this.submitReport()}>
							<ReportButtonText>
								Report
							</ReportButtonText>
						</ReportButton>
					</ReportView>
				</Modal>
				<SendNotification
					show_notification={show_notification}
					done={() => this.setState({ show_notification: false })}
					message={notificationMessage}
				/>
				<FlatList
					key="scrollView"
					data={confessionsList}
					style={{ backgroundColor: colors.bgColor }}
					renderItem={this.createConfessionCards}
					keyExtractor={item => item.id}
					refreshing={fetchStatus === 2}
					onRefresh={() => this.generateGraphRequest()}
					onEndReachedThreshold={0.2}
					onEndReached={() => this.fetchMore()}
				/>
				{ fetchStatus !== 1 ? null
					: <ActivityIndicator />
				}
				<ActionSheet
					ref={(o) => { this.ActionSheet = o; }}
					options={actionSheetButtonArray}
					cancelButtonIndex={0}
					destructiveButtonIndex={2}
					onPress={(i) => this.handleActionSheet(i)}
				/>
			</Layout>
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
