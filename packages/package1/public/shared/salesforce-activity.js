window.SalesforceActivity = window.SalesforceActivity || {};

window.SalesforceActivity.getInArguments = function (payload) {
  var hasInArguments = Boolean(
    payload &&
    payload['arguments'] &&
    payload['arguments'].execute &&
    payload['arguments'].execute.inArguments &&
    payload['arguments'].execute.inArguments.length > 0
  );

  return inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};
};

window.SalesforceActivity.generateRandomID = function () {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
};
