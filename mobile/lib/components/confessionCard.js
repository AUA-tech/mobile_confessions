import React, { Component, PureComponent } from 'react';
import styled from 'styled-components/native';
import { Text, Image, View, Clipboard, TouchableOpacity } from 'react-native';
import moment from 'moment';

import CommentCard from './commentCard';
import {
	width,
	COMMENT_PADDING,
} from '../constants/styles';
import colors from '../constants/colors';
import { linkifyMessage } from '../utils';

class ConfessionCard extends Component {
	state = {
		seeMore: false,
	}

	shouldComponentUpdate(nextProps, nextState) {
		const checkReactions = (nextReactions, prevReactions) => {
			if ((!nextReactions && prevReactions) || (nextReactions && !prevReactions)) {
				return true;
			}
			if (nextReactions && prevReactions) {
				if (nextReactions.data.length !== prevReactions.data.length) {
					return true;
				}
			}
			return false;
		};
		const checkComments = (nextComments, prevComments) => {
			if ((!nextComments && prevComments) || (nextComments && !prevComments)) {
				return true;
			}
			if (nextComments && prevComments) {
				if (nextComments.data.length !== prevComments.data.length) {
					return true;
				}

				const needToUpdate = nextComments.data.some((nextComment, i) => {
					if (checkReactions(nextComment.reactions, prevComments.data[i].reactions)) {
						return true;
					}
					if (checkComments(nextComment.comments, prevComments.data[i].comments)) {
						return true;
					}
					return false;
				});
				return needToUpdate;
			}
			return false;
		};
		if (nextProps.isHidden !== this.props.isHidden) {
			return true;
		}
		if (nextState.seeMore !== this.state.seeMore) {
			return true;
		}
		if (nextProps.message !== this.props.message) {
			return true;
		}
		if (checkReactions(nextProps.reactions, this.props.reactions)) {
			return true;
		}
		if (checkComments(nextProps.comments, this.props.comments)) {
			return true;
		}
		return false;
	}

	selectAndOpenActionSheet = (id) => {
		const { selectPostId, openActionSheet } = this.props;
		selectPostId(id);
		openActionSheet();
	}

	copyOnLongPress = () => {
		const { showCopied, message } = this.props;
		showCopied();
		Clipboard.setString(message);
	}

	render() {
		const {
			id,
			message,
			full_picture,
			attachments,
			created_time,
			reactions,
			comments,
			isHidden,
			openReactionsModal,
		} = this.props;
		// If image attachment exists, get it's ratio
		const imageHeight = attachments ? attachments.data[0].media.image.height : undefined;
		const imageWidth = attachments ? attachments.data[0].media.image.width : undefined;
		const ratio = imageWidth / imageHeight;
		const numberOfReactions = reactions ? reactions.data.length : 0;
		const numberOfComments = comments ? comments.data.length : 0;

		const confessionNumberMatch = message && message.match(/#([0-9]+)\d/); // Match a regexp for extracting confession number
		const confessionNumber = confessionNumberMatch ? confessionNumberMatch[0] : ''; // Match data is an array so we validate and take the first item if valid
		// We also need to clear the message if the match is not null
		const clearedMessage =
			confessionNumberMatch ?
				message.split(confessionNumber)[1] :
				message;

		const linkifiedMessage = linkifyMessage(clearedMessage);

		const commentsUi = comments &&
		(
			this.state.seeMore ?
				comments.data.map(comment => (
					<CommentCard
						key={comment.id}
						{...comment}
						openReactionsModal={postId => openReactionsModal(postId)}
					/>
				)) :
				<CommentCard
					key={comments.data[0].id}
					{...comments.data[0]}
					openReactionsModal={postId => openReactionsModal(postId)}
				/>
		);
		let content = null;
		if (isHidden) {
			content = (
				<CardView>
					<TextContentView>
						<RowView>
							<NumberText>{confessionNumber}</NumberText>
							{/* <DateText>{moment(created_time).format('MMM D, HH:mm')}</DateText> */}
							<ActionView onPress={() => this.selectAndOpenActionSheet(id)}>
								<ActionSheetButton
									style={{ transform: [ { rotateZ: '180deg' } ], marginTop: 15 }} // this marginTop thing is a hacky way...
									source={require('../assets/actionSheetButton.png')}
								/>
							</ActionView>
						</RowView>
					</TextContentView>
				</CardView>
			);
		} else {
			content = (
				<CardView>
					<TextContentView>
						<RowView>
							<NumberText>{confessionNumber}</NumberText>
							<DateText>{moment(created_time).format('MMM D, HH:mm')}</DateText>
						</RowView>
						<Text style={{ fontFamily: 'Roboto' }} onLongPress={this.copyOnLongPress}>
							{linkifiedMessage}
						</Text>
					</TextContentView>
					{ !full_picture ?
						null :
						<Image
							style={{ width, height: width / ratio }}
							source={{ uri: attachments.data[0].media.image.src }}
						/>
					}
					<RowView style={{ padding: 10 }}>
						<RowView>
							<LikesButton onPress={() => openReactionsModal(id)}>
								<Text style={{ fontFamily: 'Roboto', color: '#666666' }}>{numberOfReactions} Likes</Text>
							</LikesButton>
							<Text style={{ paddingHorizontal: 5, fontFamily: 'Roboto', color: '#666666' }}>{numberOfComments} Comment</Text>
						</RowView>
						<ActionView onPress={() => this.selectAndOpenActionSheet(id)}>
							<ActionSheetButton
								source={require('../assets/actionSheetButton.png')}
							/>
						</ActionView>
					</RowView>
					{
						comments &&
							<View style={{ backgroundColor: '#FAFAFA', paddingBottom: 5 }}>
								{commentsUi}
								{/* This is ugly af, need to find better solution */}
								{
									commentsUi &&
									comments.data.length > 1 &&
									(
										this.state.seeMore ?
											<ShowCommentView>
												<ShowCommentButton onPress={() => this.setState({ seeMore: false })}>
													<ShowCommentText>See less comments</ShowCommentText>
												</ShowCommentButton>
												<View />
											</ShowCommentView> :
											<ShowCommentView>
												<ShowCommentButton onPress={() => this.setState({ seeMore: true })}>
													<ShowCommentText>See more comments</ShowCommentText>
												</ShowCommentButton>
												<View />
											</ShowCommentView>
									)
								}
							</View>
					}
				</CardView>
			);
		}
		return content;
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
	flex-direction: row;
	justify-content: space-between;
`;

const ShowCommentText = styled.Text`
	font-family: Roboto;
	color: #4C4C4D;
`;

const LikesButton = styled.TouchableOpacity`
	padding-horizontal: 5;
`;

const ActionSheetButton = styled.Image`
	width: 15;
	height: 15;
`;

const NumberText = styled.Text`
  color: ${colors.headerColor};
  font-weight: 700;
  font-size: 20;
  font-family: Roboto;
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

const TextContentView = styled.View`
  padding-horizontal: 10;
  padding-vertical: 10;
`;

const CardView = styled.View`
  background-color: white;
  margin-bottom: 5;
`;

const ActionView = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: 30;
`;

export default ConfessionCard;
