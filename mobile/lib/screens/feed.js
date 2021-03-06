import React, { PureComponent } from 'react';
import { FlatList, AsyncStorage, ActivityIndicator, Alert } from 'react-native';
import { differenceBy } from 'lodash';
import ActionSheet from 'react-native-actionsheet';
import { NavigationActions } from 'react-navigation';

import Layout from '../components/layout';
import TabIcon from '../components/tabIcon';
import ConfessionCard from '../components/confessionCard';
import SendNotification from '../components/sendNotification';
import ReportModal from '../components/reportModal';
import ReactionsModal from '../components/reactionsModal';
import colors from '../constants/colors';
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
				const paramsAction = NavigationActions.setParams({
					params: { refresh: true },
					key: 'Home',
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
			fetchStatus: 2,
			hiddenPosts: [],
			modalVisible: false,
			actionSheetSelectedId: '',
			showNotification: false,
			reportText: '',
			reactionsModalVisible: false,
			reactionsArray: [],
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
		const { navigation } = this.props;
		const hiddenPostsJson = await AsyncStorage.getItem('hiddenPosts');
		const hiddenPosts = JSON.parse(hiddenPostsJson) || [];
		this.setState({ hiddenPosts });
		navigation.setParams({ refresh: false });
	}

	componentWillUpdate(nextProps) {
		const { navigation } = nextProps;
		const { state: { params } } = navigation;
		if (params && params.refresh) {
			this.flatListRef.scrollToIndex({ animated: true, index: 0 });
		}
	}

	componentDidUpdate() {
		const { navigation } = this.props;
		const { state: { params } } = navigation;
		if (params && params.refresh) {
			try {
				this.generateGraphRequest();
				navigation.setParams({ refresh: false });
			} catch (error) {
				console.log(error);
			}
		}
	}

	responseInfoCallback = (error, result) => {
		if (error) {
			AsyncStorage.getItem('cachedPosts')
				.then((cachedPostsJson) => {
					const cachedPosts = JSON.parse(cachedPostsJson) || [];
					this.setState({ fetchStatus: 0, confessionsList: cachedPosts });
				});
			// May later change to 4, which will mean error: not needed yet
		} else {
			const { confessionsList } = this.state;
			const { data, paging } = result;
			// const newPostsList = differenceBy(data, confessionsList, 'id');
			const newList = data || confessionsList;
			const newListFiltered = newList.filter(i => i.message);
			// status 0 means nothing to load
			this.setState({ confessionsList: newListFiltered, paging, fetchStatus: 0 }, () => {
				const updatedCachedPosts = JSON.stringify(newList.slice(0, 25));
				AsyncStorage.setItem('cachedPosts', updatedCachedPosts);
			});
		}
	}

	fetchPostReactions = (id) => {
		const callback = (error, result) => {
			if (error) {
				return;
			}
			const reactionsArray = result.reactions ? result.reactions.data : [];
			this.setState({ reactionsArray });
		};
		fetchFb(id, 'reactions', callback);
	}

	createConfessionCards = ({ item: confession }) => (
		<ConfessionCard
			{...confession}
			openReactionsModal={(id) => {
				this.fetchPostReactions(id);
				this.setState({ reactionsModalVisible: true });
			}}
			isHidden={this.state.hiddenPosts.includes(confession.id)}
			showCopied={() => this.setState({ showNotification: true, notificationMessage: 'Confession Copied' })}
			selectPostId={postId => this.setState({ actionSheetSelectedId: postId })}
			openActionSheet={() => this.ActionSheet.show()}
		/>
	);

	generateGraphRequest = () => {
		this.setState({ fetchStatus: 2 }); // loading
		fetchFb('/auaindulgence/feed', 'posts', this.responseInfoCallback);
	}

	fetchMore = async () => {
		const { paging, confessionsList } = this.state;
		this.setState({ fetchStatus: 1 }); // loading
		if (paging) {
			const { newList, newPaging } = await fetchNext(paging.next, confessionsList);
			this.setState({ confessionsList: newList, paging: newPaging, fetchStatus: 0 });
		}
	}

	handleActionSheet(index) {
		const { hiddenPosts: statePosts, actionSheetSelectedId } = this.state;
		const isHidden = statePosts.includes(actionSheetSelectedId);
		const alertMessage = isHidden ? 'Unhide this post?' : 'Hide this post?';
		switch (index) {
		case 0:
			break;
		case 1:
			Alert.alert(alertMessage, '', [
				{ text: 'No', onPress: null, style: 'cancel' },
				{
					text: 'Yes',
					onPress: async () => {
						let hiddenPosts = [];
						if (isHidden) {
							hiddenPosts = statePosts.filter(postId => postId !== actionSheetSelectedId);
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
		if (reportText.trim()) {
			const actionSheetSelectedObj =
				confessionsList.filter(conf => conf.id === actionSheetSelectedId)[0];
			const actionSheetSelectedMsg = actionSheetSelectedObj && actionSheetSelectedObj.message;

			this.setState({
				reportText: '',
				showNotification: true,
				notificationMessage: 'Report Submitted',
				modalVisible: false,
			});

			const feedback = `REPORT: ${reportText} Message: ${actionSheetSelectedMsg}`;
			const fetchedRes = await awsPost('send_feedback', { feedback });
			const res = await fetchedRes.json();
			if (res.message !== 'Success') {
				Alert.alert('Oops, report was not submitted');
			}
		}
	}

	render() {
		const {
			fetchStatus,
			hiddenPosts,
			modalVisible,
			reactionsModalVisible,
			confessionsList,
			actionSheetSelectedId,
			showNotification,
			reportText,
			notificationMessage,
			reactionsArray,
		} = this.state;
		const actionSheetButtonArray = [
			'Cancel',
			hiddenPosts.includes(actionSheetSelectedId) ? 'Unhide' : 'Hide',
			'Report',
		];

		return (
			<Layout headerTitle='Feed'>
				<ReactionsModal
					modalVisible={reactionsModalVisible}
					closeModal={() => this.setState({ reactionsModalVisible: false, reactionsArray: [] })}
					data={reactionsArray}
				/>
				<ReportModal
					modalVisible={modalVisible}
					reportText={reportText}
					onReportTextChange={t => this.setState({ reportText: t })}
					closeModal={() => this.setState({ modalVisible: false })}
					submitReport={() => this.submitReport()}
				/>
				<SendNotification
					showNotification={showNotification}
					done={() => this.setState({ showNotification: false })}
					message={notificationMessage}
				/>
				<FlatList
					key='scrollView'
					data={confessionsList}
					onEndReachedThreshold={0.2}
					refreshing={fetchStatus === 2}
					keyExtractor={item => item.id}
					onEndReached={() => this.fetchMore()}
					renderItem={this.createConfessionCards}
					style={{ backgroundColor: colors.bgColor }}
					onRefresh={() => this.generateGraphRequest()}
					ref={(flatListRef) => { this.flatListRef = flatListRef; }}
				/>
				{ fetchStatus !== 1 ? null
					: <ActivityIndicator />
				}
				<ActionSheet
					ref={(o) => { this.ActionSheet = o; }}
					options={actionSheetButtonArray}
					cancelButtonIndex={0}
					destructiveButtonIndex={2}
					onPress={i => this.handleActionSheet(i)}
				/>
			</Layout>
		);
	}
}
