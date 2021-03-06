const botBuilder = require('claudia-bot-builder')
const parseIntent = require('./parse_intent')

const getData = require('./get_data')
const getPopulation = require('./get_population')
const getCrime = require('./get_crime')
const getMap = require('./get_map')
const layerMap = require('./layer_map')
const ping = require('./ping')
const notes = require('./notes')
const hal = require('./hal')
const help = require('./help')

const api = botBuilder(function (request, originalRequest) {

  // console.log("env 1: " + JSON.stringify(request))
  // console.log("env 2: " + JSON.stringify(originalRequest))

  var inputs = parseIntent(request, originalRequest);
  switch(inputs.intent) {
    case 'error':
      return "I'm sorry, Dave. I'm afraid I can't do that.";
      break;

    case 'Hello':
      return help("hello");
      break;

    case 'Help':
      return help(inputs.slots.Dataset);
      break;

    case 'Hal':
      return hal.sorry();
      break;

    case 'Ping':
      return ping(inputs.slots.Dataset);
      break;

    case 'GetData':
      return getData(inputs.slots.Dataset, inputs.slots.Location, originalRequest.env);
      break;

    case 'GetPopulation':
      return getPopulation(inputs.slots.Location, originalRequest.env);
      break;

    case 'GetMap':
      return getMap(inputs.slots.Location);
      break;

    case 'LayerMap':
      return layerMap(inputs.slots.Dataset, inputs.slots.Location);
      break;

    case 'SummarizeData':
      return "Summarize not yet implemented."
      break;

    case 'AddNote':
      return notes(inputs.slots.Dataset, inputs.slots.Location, originalRequest.env);
      break;

    case 'GetCrime':
      return getCrime(inputs.slots.Location);
      break;
    case 'ExitApp':
      // return a JavaScript object to set advanced response params
      // this prevents any packaging from bot builder and is just
      // returned to Alexa as you specify
      return {
        response: {
          outputSpeech: {
            type: 'PlainText',
            text: 'Bye from Sonar!'
          },
          shouldEndSession: true
        }
      };
      break;
    default:
      return Promise.resolve("Sorry, there was an error in Sonar.");

  }
}, { platforms: ['alexa', 'slackSlashCommand', 'facebook'] });

module.exports = api;
