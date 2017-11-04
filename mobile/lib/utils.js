export const serverAddress = 'https://zcljj54dwg.execute-api.us-east-1.amazonaws.com/dev/confessions';
const awsFetch = apiFunction => fetch(`${serverAddress}/${apiFunction}`)

export default awsFetch
