import React from 'react';
import { Text, Linking } from 'react-native';
import { differenceBy } from 'lodash';
import { GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import linkify from 'linkify-it';

import { accessToken } from './constants/token';

const linkifyIt = linkify().set({ fuzzyLink: false });

const serverAddress = 'https://zcljj54dwg.execute-api.us-east-1.amazonaws.com/dev/confessions';

const createRequestOptions = body => ({
	method: 'POST',
	headers: new Headers({ 'Content-Type': 'application/json' }),
	body: JSON.stringify(body),
});

export const linkTo = link =>
	Linking.canOpenURL(link)
		.then(supported => supported && Linking.openURL(link));

export const fetchNext = async (pagingNext, confessionsList) => {
	try {
		const promise = await fetch(pagingNext);
		const res = await promise.json();
		const { data, paging } = res;
		const newPostsList = differenceBy(data, confessionsList, 'id');
		const newList = [ ...confessionsList, ...newPostsList ];
		return { newList, newPaging: paging };
	} catch (e) {
		console.warn(e);
		return null;
	}
};

export const fetchFb = (id, type, callback) => {

	const opts = {
		parameters: {
			access_token: {
				string: accessToken,
			},
			fields: {
				string: '',
			},
		},
	};

	switch (type) {
	case 'posts':
		opts.parameters.fields.string = 'id,message,link,created_time,attachments,picture,full_picture,reactions,comments{comments{reactions,message,created_time,from},message,reactions,created_time,from}';
		break;
	case 'user':
		opts.parameters.fields.string = 'picture,name,link';
		break;
	case 'reactions':
		opts.parameters.fields.string = 'reactions.limit(1000){name,id,type,pic,link}';
		break;
	//	case 'comments':
	//		opts.parameters.fields.string = 'comments{comments{reactions,message,created_time,from},message,reactions,created_time,from}';
	//	break;
	default:
		console.error('No such fb fetch type');
		break;
	}

	const infoRequest = new GraphRequest(
		id,
		opts,
		callback,
	);

	new GraphRequestManager().addRequest(infoRequest).start();
};

export const awsPost = (apiFunction, body) =>
	fetch(`${serverAddress}/${apiFunction}`, createRequestOptions(body));

export const awsGet = apiFunction => fetch(`${serverAddress}/${apiFunction}`);

export const linkifyMessage = (message) => {
	const linkArr = linkifyIt.match(message);
	if (!linkArr) return message;

	const aux = (mes, i, acc) => {
		if (!linkArr[i]) return acc;
		const splitted = mes.split(linkArr[i].raw);
		acc.push((
			<Text style={{ fontFamily: 'Roboto' }} key={splitted[0]}>
				{splitted[0]}
				<Text style={{ color: 'blue', fontFamily: 'Roboto' }} onPress={() => linkTo(linkArr[i].raw)}>
					{linkArr[i].raw}
				</Text>
			</Text>
		));
		return aux(splitted[1], i + 1, acc);
	};
	return aux(message, 0, []);
};
