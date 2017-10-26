const AWS = require('aws-sdk');
const moment = require('moment');
const uuid = require('uuid');

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
module.exports.send_feedback = (event, context, callback) => {
    const data = JSON.parse(event.body);
    const {some_thing} = data;
};