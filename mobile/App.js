import { Platform, AsyncStorage } from 'react-native';
import { TabNavigator } from 'react-navigation';
import SplashScreen from 'react-native-splash-screen';
import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from 'react-native-fcm';

import colors from './lib/constants/colors';
import ConfessionsFeedScreen from './lib/screens/feed';
import NewConfessionScreen from './lib/screens/confession';
import CreditsScreen from './lib/screens/credits';

// this shall be called regardless of app state: running, background or not running.
// Won't be called when app is killed by user in iOS
FCM.on(FCMEvent.Notification, async (notif) => {
	// there are two parts of notif. notif.notification contains the notification payload,
	// notif.data contains data payload
	// if (notif.local_notification){
	// 	//this is a local notification
	// }
	// if (notif.opened_from_tray){
	//   //iOS: app is open/resumed because user clicked banner
	//   //Android: app is open/resumed because user clicked banner or tapped app icon
	// }
	// await someAsyncCall();

	if (Platform.OS === 'ios') {
		// optional
		// iOS requires developers to call completionHandler to end notification process.
		// If you do not call it your background remote notifications could be throttled,
		// to read more about it see the above documentation link.
		// This library handles it for you automatically with default behavior
		// (for remote notification, finish with NoData; for WillPresent, finish depend on
		// "show_in_foreground").However if you want to return different result,
		// follow the following code to override
		// notif._notificationType is available for iOS platfrom
		switch (notif._notificationType) {
		case NotificationType.Remote:
			// other types available:
			// RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
			notif.finish(RemoteNotificationResult.NewData);
			break;
		case NotificationType.NotificationResponse:
			notif.finish();
			break;
		case NotificationType.WillPresent:
			// other types available: WillPresentNotificationResult.None
			notif.finish(WillPresentNotificationResult.All);
			break;
		default:
			break;
		}
	}
});
FCM.on(FCMEvent.RefreshToken, (token) => {
	console.log(token);
	// fcm token may not be available on first load, catch it here
});

const screens = {
	Home: {
		screen: ConfessionsFeedScreen,
	},
	Notifications: {
		screen: NewConfessionScreen,
	},
	Credits: {
		screen: CreditsScreen,
	},
};

const options = Platform.select({
	ios: {
		tabBarPosition: 'bottom',
		animationEnabled: true,
		tabBarOptions: {
			activeTintColor: colors.primaryColor,
		},
	},
	android: {
		tabBarPosition: 'bottom',
		animationEnabled: true,
		tabBarOptions: {
			activeTintColor: colors.primaryColor,
			inactiveTintColor: colors.inactiveTintColor,
			pressColor: colors.primaryColor,
			showIcon: true,
			tabStyle: {
				backgroundColor: 'white',
				height: 60,
			},
			style: {
				backgroundColor: 'white',
				borderTopWidth: 1,
				borderTopColor: '#D6D6D6',
			},
			iconStyle: {
				marginTop: 10,
			},
		},
	},
});

const MyApp = TabNavigator(screens, options);
MyApp.prototype.componentWillUnmount = () => {
	// stop listening for events
	this.notificationListener.remove();
};
MyApp.prototype.componentDidMount = () => {
	FCM.requestPermissions().then(() => console.log('granted')).catch(() => console.log('notification permission rejected'));

	FCM.subscribeToTopic('/topics/confessions');

	FCM.getFCMToken().then((token) => {
		console.log(token);
		// store fcm token in your server
	});

	this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
		console.log(notif);
		// optional, do some component related stuff
	});

	// initial notification contains the notification that launchs the app.
	// If user launchs app by clicking banner,
	// the banner notification info will be here rather than through FCM.on event
	// sometimes Android kills activity when app goes to background,
	// and when resume it broadcasts notification before JS is run.
	// You can use FCM.getInitialNotification() to capture those missed events.
	// initial notification will be triggered all the time
	// even when open app by icon so send some action identifier when you send notification
	FCM.getInitialNotification().then((notif) => {
		console.log(notif);
	});

	SplashScreen.hide();
	AsyncStorage.getItem('hided_posts', (err, res) => {
		if (err) {
			console.warn('AsyncStorage error', err);
			return;
		}
		if (res === null) {
			AsyncStorage.setItem('hided_posts', JSON.stringify([]));
		}
	});
	AsyncStorage.getItem('cachedPosts', (err, res) => {
		console.warn(res);
		if (err) {
			console.warn('AsyncStorage error', err);
			return;
		}
		if (res === null) {
			AsyncStorage.setItem('cachedPosts', JSON.stringify([]));
		}
	});
};

export default MyApp;
