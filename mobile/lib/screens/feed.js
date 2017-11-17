import React, { PureComponent } from 'react';
import { FlatList, AsyncStorage, ActivityIndicator, View, Text, TextInput, Alert } from 'react-native';
import { differenceBy } from 'lodash';
import Modal from 'react-native-modal';
import ActionSheet from 'react-native-actionsheet';
import { NavigationActions } from 'react-navigation';

import Layout from '../components/layout';
import TabIcon from '../components/tabIcon';
import ConfessionCard from '../components/confessionCard';
import SendNotification from '../components/sendNotification';
import colors from '../constants/colors';
import { width } from '../constants/styles';
import { fetchFb, fetchNext } from '../utils';

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
			shouldShowNotification: false,
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
			console.log('Error fetching data: ', error);
			// May later change to 4, which will mean error: not needed yet
			this.setState({ fetchStatus: 0 });
		} else {
			const { confessionsList } = this.state;
			const { data, paging } = result;
			const newPostsList = differenceBy(data, confessionsList, 'id');
			const newList = [ ...newPostsList, ...confessionsList ];
			// status 0 means nothing to load
			this.setState({ confessionsList: newList, paging, fetchStatus: 0 });
		}
	}

	createConfessionCards = ({ item: confession }) => (
		<ConfessionCard
			{...confession}
			isHidden={this.state.hiddenPosts.includes(confession.id)}
			show_copied={() => this.setState({ shouldShowNotification: true })}
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

	render() {
		const {
			confession,
			fetchStatus,
			hiddenPosts,
			modalVisible,
			confessionsList,
			actionSheetSelectedId,
			shouldShowNotification,
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
					<View style={{ height: width / 1.5, width: width / 1.5, backgroundColor: 'white' }}>
						<Text>
							{`What's wrong with this post ${actionSheetSelectedId}? Send report to AUA tech support!`}
						</Text>
						<TextInput
							style={{
								height: '50%',
								width: '100%',
								fontSize: 20,
							}}
							multiline
							numberOfLines={4}
							onChangeText={this.onTextChange}
							value={confession}
							placeholder="Write your report"
							placeholderTextColor={colors.placeholderColor}
						/>
					</View>
				</Modal>
				<SendNotification
					shouldShowNotification={shouldShowNotification}
					done={() => this.setState({ shouldShowNotification: false })}
					message="Confession Copied"
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
