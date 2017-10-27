const AWS = require('aws-sdk');
const moment = require('moment');
const uuid = require('uuid');
const FB = require('fb');
//const SES = new AWS.SES();

module.exports.get_confession = (event, context, callback) => {
    const data = JSON.parse(event.body);
    const {some_thing} = data;
};
module.exports.process_conf = (event, context, callback) => {
    const data = JSON.parse(event.body);
    const {some_thing} = data;
};
module.exports.send_confession = (event, context, callback) => {
    console.log(event.body);
    const data = JSON.parse(event.body);
    if(data) {
        const {confession} = data;
        console.log(confession);
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Sent to fb group',
                confession
                // input: event
            })
        };
        context.succeed(response);
    } else {
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Didn\'t work'
            })
        };
        context.succeed(response);
    }
};
module.exports.get_access_token = (event, context, callback) => {

    FB.api('oauth/access_token', {
        client_id: process.env.FB_APP_ID,
        client_secret: process.env.FB_APP_SECRET,
        grant_type: 'client_credentials'
    }, res => {
        if (!res || res.error) {
            
            const error_message = !res ? 'error occurred during the token request' : res.error;
            const response = {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Didnt work'
                })
            };
            context.succeed(response);
            // context.failed(new Error(error_message));
            console.log(error_message);
            return;
        }
        const {
            access_token
        } = res;

        const response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Success',
                access_token
            })
        };
        context.succeed(response);
        // FB.setAccessToken(access_token);
    });

}
module.exports.send_feedback = (event, context, callback) => {
    const data = JSON.parse(event.body);
    const {some_thing} = data;
};
function post_confession (confession) {
    // TODO: Need to implement FB sdk so that 
    // we are able to post confessions in the group
}