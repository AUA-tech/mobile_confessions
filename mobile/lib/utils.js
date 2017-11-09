import { differenceBy } from 'lodash';
import { GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import { accessToken } from './constants/token';

const serverAddress = 'https://zcljj54dwg.execute-api.us-east-1.amazonaws.com/dev/confessions';

const createRequestOptions = body => ({
  method: 'POST',
  headers: new Headers({ 'Content-Type':'application/json'}),
  body: JSON.stringify(body)
})

export const fetch_next = async (pagingNext, confessionsList) => {
  try {
    const promise = await fetch(pagingNext);
    const res = await promise.json();
    const { data, paging } = result;
    const newPostsList = differenceBy(data, confessionsList, 'id');
    const newList = [ ...confessionsList, ...newPostsList ];
    return {newList, newPaging: paging}; 
  } catch(e) {
    console.warn(e);
  }
}

export const fetch_fb = (id, type, callback) => {

  const opts = {
    parameters: {
      access_token: {
        string: accessToken
      },
      fields: {
        string: '',
      }
    }
  };
  
  switch (type) {
    case 'posts':
      opts.parameters.fields.string = 'id,message,link,created_time,attachments,picture,full_picture,reactions,comments{comments{reactions,message,created_time,from},message,reactions,created_time,from}';
      break;
    case 'user':
      opts.parameters.fields.string = 'picture,name';
      break;
    // case 'comments':
    //   opts.parameters.fields.string = 'comments{comments{reactions,message,created_time,from},message,reactions,created_time,from}';
    //   break;
    default:
      console.error('No such fb fetch type');
      break;
  }

  const infoRequest = new GraphRequest(
    id,
    opts,
    callback
  );

  new GraphRequestManager().addRequest(infoRequest).start();
}

export const awsPost = (apiFunction, body) =>
  fetch(`${serverAddress}/${apiFunction}`, createRequestOptions(body))

export const awsGet = apiFunction => fetch(`${serverAddress}/${apiFunction}`);
