import React, { PureComponent } from 'react';
import styled from 'styled-components/native';
import { Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import moment from 'moment';

import {
	width,
	COMMENT_PADDING,
	COMMENTER_REPLY_IMAGE,
	REPLY_LEFT_PADDING,
} from '../constants/styles';
import colors from '../constants/colors';
import { linkTo, linkifyMessage } from '../utils';

class CommentReplyCard extends PureComponent {
	constructor(props) {
		super(props);
		const { from } = this.props;
		const pic = from && from.picture && from.picture.data && from.picture.data.url;
		const link = from && from.link;
		this.state = {
			avatar: pic || 'placeholder',
			link: link || '',
		};
	}

	render() {
		const {
			id,
			created_time,
			message,
			reactions,
			from,
			openReactionsModal,
		} = this.props;

		const linkifiedMessage = linkifyMessage(message);

		const numberOfReactions = reactions ? reactions.data.length : 0;

		return (
			<RowView style={{ padding: COMMENT_PADDING, paddingLeft: REPLY_LEFT_PADDING }}>
				<TouchableWithoutFeedback onPress={() => linkTo(this.state.link)} >
					<CommenterReplyImage
						source={{ uri: this.state.avatar }}
					/>
				</TouchableWithoutFeedback>
				<CommentReplyMessageView>
					<RowView>
						<CommenterReplyName onPress={() => linkTo(this.state.link)}>
							{from && from.name}
						</CommenterReplyName>
						<DateText>{moment(created_time).format('MMM D, HH:mm')}</DateText>
					</RowView>
					<Text style={{ fontFamily: 'Roboto' }}>
						{linkifiedMessage}
					</Text>
					<TouchableOpacity style={{ paddingVertical: 5 }} onPress={() => openReactionsModal(id)}>
						<Text style={{ fontFamily: 'Roboto', color: '#666666' }}>{numberOfReactions} Likes</Text>
					</TouchableOpacity>
				</CommentReplyMessageView>
			</RowView>
		);
	}
}

const CommenterReplyImage = styled.Image`
	width: ${COMMENTER_REPLY_IMAGE};
	height: ${COMMENTER_REPLY_IMAGE};
	border-radius: ${COMMENTER_REPLY_IMAGE / 2};
`;

const CommenterReplyName = styled.Text`
	color: ${colors.headerColor};
	fontWeight: 700;
	width: ${width * 0.3};
	font-family: Roboto;
`;

const CommentReplyMessageView = styled.View`
	paddingLeft: 10;
	width: ${width - REPLY_LEFT_PADDING - COMMENTER_REPLY_IMAGE - (2 * COMMENT_PADDING)};
`;

const DateText = styled.Text`
	color: ${colors.softTextColor};
	font-weight: 300;
	font-size: 13;
	font-family: Roboto;
`;

const RowView = styled.View`
	flex-direction: row;
	justify-content: space-between;
`;

export default CommentReplyCard;
