const serverAddress = 'https://zcljj54dwg.execute-api.us-east-1.amazonaws.com/dev/confessions';

const createRequestOptions = body => ({
  method: 'POST',
  headers: new Headers({ 'Content-Type':'application/json'}),
  body: JSON.stringify(body)
})

export const awsPost = (apiFunction, body) =>
  fetch(`${serverAddress}/${apiFunction}`, createRequestOptions(body))

export const awsGet = apiFunction => fetch(`${serverAddress}/${apiFunction}`);
