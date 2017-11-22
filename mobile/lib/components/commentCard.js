import React, { PureComponent } from 'react';
import styled from 'styled-components/native';
import { Text, View, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import moment from 'moment';

import CommentReplyCard from './commentReplyCard';
import colors from '../constants/colors';
import {
	width,
	COMMENT_PADDING,
	COMMENTER_IMAGE,
	REPLY_LEFT_PADDING,
} from '../constants/styles';
import { fetchFb, linkTo, linkifyMessage } from '../utils';

class CommentCard extends PureComponent {
	state = {
		avatar: 'placeholder',
		link: '',
		seeMore: false,
	}

	async componentWillMount() {
		const { from } = this.props;
		if (from) {
			fetchFb(from.id, 'user', this.responseInfoCallback);
		}
	}

	responseInfoCallback = (error, result) => {
		if (error) {
			console.warn(error);
			return;
		}
		if (result && result.picture && result.picture.data) {
			this.setState({ avatar: result.picture.data.url, link: result.link });
		}
	}

	render() {
		const {
			id,
			created_time,
			message,
			reactions,
			from,
			comments,
			openReactionsModal,
		} = this.props;

		const linkifiedMessage = linkifyMessage(message);

		const commentReplies = comments &&
		(
			this.state.seeMore ?
				comments.data.map(comment => (
					<CommentReplyCard
						key={comment.id}
						{...comment}
						openReactionsModal={postId => openReactionsModal(postId)}
					/>
				)) :
				<CommentReplyCard
					key={comments.data[0].id}
					{...comments.data[0]}
					openReactionsModal={postId => openReactionsModal(postId)}
				/>
		);

		const numberOfReactions = reactions ? reactions.data.length : 0;
		const numberOfComments = comments ? comments.data.length : 0;

		return (
			<View style={{ padding: COMMENT_PADDING }}>
				<RowView>
					<TouchableWithoutFeedback onPress={() => linkTo(this.state.link)} >
						<CommenterImage
							source={{ uri: this.state.avatar }}
						/>
					</TouchableWithoutFeedback>
					<CommentMessageView>
						<RowView>
							<CommenterName onPress={() => linkTo(this.state.link)}>
								{from && from.name}
							</CommenterName>
							<DateText>{moment(created_time).format('MMM D, HH:mm')}</DateText>
						</RowView>
						<Text style={{ fontFamily: 'Roboto' }}>
							{linkifiedMessage}
						</Text>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<LikesButton onPress={() => openReactionsModal(id)}>
								<Text style={{ fontFamily: 'Roboto', color: '#666666' }}>{numberOfReactions} Likes</Text>
							</LikesButton>
							<Text style={{ paddingHorizontal: 5, fontFamily: 'Roboto', color: '#666666' }}>{numberOfComments} Comment</Text>
						</View>
					</CommentMessageView>
				</RowView>
				{commentReplies}
				{/* This is ugly af, need to find better solution */}
				{
					commentReplies &&
          comments.data.length > 1 &&
					(
						this.state.seeMore ?
							<ShowCommentView>
								<ShowCommentButton onPress={() => this.setState({ seeMore: false })}>
									<ShowCommentText>See less replies</ShowCommentText>
								</ShowCommentButton>
								<View />
							</ShowCommentView> :
							<ShowCommentView>
								<ShowCommentButton onPress={() => this.setState({ seeMore: true })}>
									<ShowCommentText>See more replies</ShowCommentText>
								</ShowCommentButton>
								<View />
							</ShowCommentView>
					)
				}
			</View>
		);
	}
}

const ShowCommentButton = styled.TouchableOpacity`
	padding-horizontal: 10px;
	padding-vertical: 5px;
	background-color: #EAEAEA;
	border-radius: 20;
`;

const ShowCommentView = styled.View`
	padding: ${COMMENT_PADDING}px;
	padding-left: ${REPLY_LEFT_PADDING}px;
	flex-direction: row;
	justify-content: space-between;
`;

const ShowCommentText = styled.Text`
	font-family: Roboto;
	color: #4C4C4D;
`;

const LikesButton = styled.TouchableOpacity`
	padding-vertical: 5;
`;

const CommenterImage = styled.Image`
  width: ${COMMENTER_IMAGE};
  height: ${COMMENTER_IMAGE};
  border-radius: ${COMMENTER_IMAGE / 2};
`;

const CommenterName = styled.Text`
  color: ${colors.headerColor};
  fontWeight: 700;
  width: ${width * 0.5}
  font-family: Roboto;
`;

const CommentMessageView = styled.View`
  paddingLeft: 10;
  width: ${width - COMMENTER_IMAGE - (2 * COMMENT_PADDING)};
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

export default CommentCard;
