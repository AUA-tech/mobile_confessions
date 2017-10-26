function sendToServer () {                      
  var form_id = '1isXsuPmEMYuhFQn91tXHH8Ks7klaDmexampleformid'
  var send_confession_link = 'https://example_link.com/conf';
  // Open the form by ID
  var form = FormApp.openById(form_id);
  // Get all form responses
  var formResponses = form.getResponses();
  // Get last response
  var formResponse = formResponses[formResponses.length - 1];
  // Get array of inputs
  var itemResponses = formResponse.getItemResponses();
  // Get first input (paragraph)
  var itemResponse = itemResponses[0];
  // Create data object
  var data = {
    "confession": itemResponse.getResponse()
  };
  // Make options object and feed data to payload
  var options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(data)
  };
  // Make request to AWS Lambda server
  UrlFetchApp.fetch(send_confession_link, options);
  Logger.log(itemResponse.getResponse());
}