const AWS = require('aws-sdk');
const moment = require('moment');
const uuid = require('uuid');
const FB = require('fb');
const SES = new AWS.SES();

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
        sendSomeEmail({confession})
        .then(() => {
            const response = {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Sent to fb group',
                    confession
                    // input: event
                })
            };
            context.succeed(response);
        })
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
        grant_type: 'client_credentials',
        scope: 'manage_pages, publish_pages',
        apiVersion: "v2.10",
        redirect_uri: 'http://localhost:3000/' // Should be the same as in FB's app settings
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

    FB.setAccessToken(/*pageToken or userToken*/);

    const msg = confession;
    FB.api('me/feed', 'POST', { message: msg}, res => {
        if(!res || res.error) {
          console.log(!res ? 'error occurred' : res.error);
          return;
        }
        console.log('Post Id: ' + res.id);
    });
}

//TODO: Create another function for posting comments as Admin.


function sendSomeEmail(params) {
    var emailParams = {
      Destination: {
        ToAddresses: [
            process.env.ADMIN_EMAIL
        ]
      },
      Message: {
        Subject: {
          Data: `New message for AUA Admin`,
          Charset: 'UTF-8'
        },
        Body: {
          Html: {
            Data: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta name="viewport" content="width=device-width">
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                <title>Simple Transactional Email</title>
                <style type="text/css">
                </style>
              </head>
              <body>
                Hi man!
                <br />
                ${params.confession}
              </body>
            </html>
  `,
            Charset: 'UTF-8'
          }
        }
      },
      Source: process.env.SUPPORT_EMAIL,
      ReplyToAddresses: [
          process.env.SUPPORT_EMAIL
      ]
    };
  
    return SES.sendEmail(emailParams).promise();
  }