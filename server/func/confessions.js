const AWS = require('aws-sdk');
const moment = require('moment');
const uuid = require('uuid');
const FB = require('fb');
const SES = new AWS.SES();

module.exports.send_confession = (event, context, callback) => {
    console.log(event.body);
    const data = JSON.parse(event.body);
    if(data) {
        const {confession} = data;
        // TODO: run AI and get the function output in is_valid_confession
        const is_valid_confession = true;
        if(is_valid_confession) {
            post_confession(context, confession);
        } else {
            sendSomeEmail({
                to_email: process.env.ADMIN_EMAIL,
                message: confession
            })
            .then(() => {
                context_succeed(context, {
                    message: 'Success',
                    confession
                })
            })
        }
    } else {
        context_succeed(context, {
            message: 'Failure'
        })
    }
};
module.exports.send_feedback = (event, context, callback) => {
    const data = JSON.parse(event.body);
    if(data) {
        const {feedback} = data;
        sendSomeEmail({
            to_email: process.env.SUPPORT_EMAIL,
            message: feedback
        })
        .then(() => {
            context_succeed(context, {
                message: 'Success',
                feedback
            })
        })
    } else {
        context_succeed(context, {
            message: 'Failure'
        })
    }
};

function post_confession (context, confession) {

    FB.setAccessToken(process.env.FB_PAGE_TOKEN);

    FB.api('me/feed', 'POST', { message: confession }, res => {
        if(!res || res.error) {
          console.log(!res ? 'error occurred' : res.error);
          return;
        } else {
            console.log('Post Id: ' + res.id);
        }
        context_succeed(context, {
            message: 'Success',
            confession
        })
    });
}

function context_succeed (context, body) {
    const response = {
        statusCode: 200,
        body: JSON.stringify(body)
    };
    context.succeed(response);
}

function sendSomeEmail(params) {
    var emailParams = {
      Destination: {
        ToAddresses: [
            params.to_email
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
                ${params.message}
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