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
    const data = JSON.parse(event.body);
    const {some_thing} = data;
    if("ERROR") {
        context.failed(new Error(err));
    } else {
        if("AI approves") {
            console.log("send to FB group");
            const response = {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Sent to fb group',
                    // input: event
                })
            };
            context.succeed(response);
        } else {
            console.log("send to admin's email");
            const response = {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Sent to admin',
                    // input: event
                })
            };
            context.succeed(response);
        }
    }
};
module.exports.send_feedback = (event, context, callback) => {
    const data = JSON.parse(event.body);
    const {some_thing} = data;
};