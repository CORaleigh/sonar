const getIntent = function (alexaPayload) {
 'use strict';
 return alexaPayload &&
   alexaPayload.request &&
   alexaPayload.request.type === 'IntentRequest' &&
   alexaPayload.request.intent;
}

const getIntentName = function (alexaPayload) {
 'use strict';
 return alexaPayload &&
   alexaPayload.request &&
   alexaPayload.request.type === 'IntentRequest' &&
   alexaPayload.request.intent &&
   alexaPayload.request.intent.name;
}

const intentNames = {
     "what": {
       "method": "GetData",
       "match": "what is the (.*) of (.*)"
     },
     "population": {
       "method": "GetPopulation",
       "match": "(.*) of (.*)"
     },
     "safety": {
       "method": "GetCrime",
       "match": "what is the (.*) of (.*)"
     },
     "map": {
       "method": "GetMap",
       "match": "(.*) of (.*)"
     }
}

module.exports = function parseIntents(request, originalRequest) {

  var intentName = getIntentName(originalRequest.body);
  var slots = {}

  if ((intentName === undefined || intentName === null || intentName == false) && request.text) {
       var keyword = request.text.split(" ")[0];

       var intent = intentNames[keyword];
       var regex = new RegExp(intent.match);
       var parse = regex.exec(request.text)

      //  console.log("request: " + request.text)
      //  console.log("parse: " + JSON.stringify(parse))
      //  Right now we'll always make sure this is the order, but that might change.
       var regexGroups = { "Dataset": 1, "Location": 2 };
       var regkeys = Object.keys(regexGroups);
      for(var i=0; i<regkeys.length; i++) {
        slots[regkeys[i]] = parse[regexGroups[regkeys[i]]];
      }
  } else {
      var intent = getIntent(originalRequest.body)
      var keys = Object.keys(intent.slots);
      for(var i=0; i<keys.length; i++) {
            slots[keys[i]] = intent.slots[keys[i]].value;
      }
 }

  return {intent: intent.method, slots: slots};
}