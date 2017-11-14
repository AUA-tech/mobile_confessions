const AWS = require('aws-sdk');
const moment = require('moment');
const uuid = require('uuid');
const FB = require('fb');
const SES = new AWS.SES();

// Implement Firebase Cloud Messaging
const admin = require("firebase-admin");
const serviceAccount = require("../service-account.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://aua-confessions.firebaseio.com"
});

module.exports.send_confession = (event, context, callback) => {
    const data = JSON.parse(event.body);
    if(data) {
        const { confession, publish_now, when_to_publish } = data;
        const options = {
            context,
            confession,
            publish_now,
            when_to_publish
        }
        // TODO: run AI and get the function output in is_valid_confession
        const is_valid_confession = true;
        if(is_valid_confession) {
            post_confession(options);
        } else {
            send_email({
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
        send_email({
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

module.exports.sendNotification = (event, context, callback) => {
    if(event.queryStringParameters){
        const queryParams = event.queryStringParameters;
    
        const rVerifyToken = queryParams['hub.verify_token']
    
        if (rVerifyToken === process.env.FB_WEBHOOK_VERIFY_TOKEN) {
            const challenge = queryParams['hub.challenge']
            
            const response = {
                'body': parseInt(challenge),
                'statusCode': 200
            };
            
            callback(null, response);
        } else {
            const response = {
                'body': 'Error, wrong validation token',
                'statusCode': 422
            };
            
            callback(null, response);
        }
    } else {
        const data = JSON.parse(event.body);
        const message = data.entry[0].changes[0].value.message;
        const is_published = data.entry[0].changes[0].value.published;
        if(is_published) {
            const confessionNumberMatch = message.match(/#([0-9]+)\d/); // Match a regexp for extracting confession number
            const confessionNumber = confessionNumberMatch ? confessionNumberMatch[0] : ''; // Match data is an array so we validate and take the first item if valid
            const clearedMessage = confessionNumberMatch ? message.split(confessionNumber)[1]  : message; // We also need to clear the message if the match is not null

            admin.messaging().sendToTopic(
            '/topics/confessions',
            {
                "notification" : {
                    "title" : confessionNumber,
                    "body"  : clearedMessage,
                    "sound" : "default"
                }
            },
            {
                "contentAvailable": true
            }
            ).then((r) => {
                context_succeed(context, {
                    message: 'Success'
                })
            })
        } else {
            context_succeed(context, {
                message: 'Failure'
            })
        }
    }
}

function post_confession (options) {

    const {
        context,
        confession,
        publish_now,
        when_to_publish
    } = options;

    FB.setAccessToken(process.env.FB_PAGE_TOKEN);

    if (publish_now) {
        FB.api('me/feed', 'POST', {
            message: confession
        }, res => {
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
    } else {
        FB.api('me/feed', 'POST', {
            message: confession,
            scheduled_publish_time: Math.round(+when_to_publish / 1000),
            published: false,
        }, res => {
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
}

function post_comment (context, postID, comment) {

    FB.setAccessToken(process.env.FB_PAGE_TOKEN);

    FB.api(`${postID}/comments`, 'POST', { message: comment }, res => {
        if(!res || res.error) {
          console.log(!res ? 'error occurred' : res.error);
          return;
        } else {
            console.log('Comment Id: ' + res.id);
        }
        context_succeed(context, {
            message: 'Success',
            comment
        })
    });
}

function post_comment_reply (context, commentID, comment) {

    FB.setAccessToken(process.env.FB_PAGE_TOKEN);

    FB.api(`${commentID}/comments`, 'POST', { message: comment }, res => {
        if(!res || res.error) {
          console.log(!res ? 'error occurred' : res.error);
          return;
        } else {
            console.log('Comment Id: ' + res.id);
        }
        context_succeed(context, {
            message: 'Success',
            comment
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

function send_email(params) {
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