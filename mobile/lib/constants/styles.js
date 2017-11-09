import { Dimensions } from 'react-native';
export const {height, width} = Dimensions.get('window');
export const COMMENT_PADDING = 10;
export const COMMENTER_IMAGE = 40;
export const COMMENTER_REPLY_IMAGE = 25;
export const MESSAGE_LEFT_PADDING = 10;
export const REPLY_LEFT_PADDING = COMMENTER_IMAGE  + MESSAGE_LEFT_PADDING;