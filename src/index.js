import { handler as alexaHandler } from 'alexa-sdk';

const handlers = {
  'LaunchRequest'() {
    console.log(`read: ${JSON.stringify(this.attributes)}`);
    if (! this.event.session.user.hasOwnProperty('accessToken')) {
      this.emit('LinkIntent');
    } else if (! this.attributes.hasOwnProperty('destination')) {
      this.emit('ConfigureIntent');
    } else {
      this.emit(':ask',
        'Listening for your new journal entry.',
        'Ready for your new journal entry.');
    }
  },
  'LinkIntent'() {
    this.emit(':tellWithLinkAccountCard',
      'Your journal is saved in Google Drive. Please use the Alexa app to link your Google account first.');
  },
  'ConfigureIntent'() {
    this.emit(':ask',
      'How would you like to save your log entries? Pick one of the following, "save in a single document", "save in a folder", or "save in a spreadsheet". You can change this at any time.',
      '"save in a single document", "save in a folder", or "save in a spreadsheet"?');
  },
  'SaveDestinationIntent'() {
    const destination = this.event.request.intent.slots.Destination.value;
    this.attributes.destination = destination;
    this.emit(':ask',
      `I'll save your logs in a ${destination} called Alexa Journal. Listening for your new log entry.`,
      'Ready for your new log entry.');
  },
  'EntryIntent'() {
    if (! this.event.session.user.hasOwnProperty('accessToken')) {
      this.emit('LinkIntent');
    } else if (! this.attributes.hasOwnProperty('destination')) {
      this.emit('ConfigureIntent');
    } else {
      const entry = this.event.request.intent.slots.Entry.value;
      const destination = this.attributes.destination;
      this.emit(':tellWithCard',
        `Saved ${entry} in your ${destination}`,
        `Saved in ${destination}`,
        `${entry}`);
    }
  },
  'SessionEndedRequest'() {
    console.log(`saving: ${JSON.stringify(this.attributes)}`);
    this.emit(':saveState', true);
  },
  'HelloWorldIntent'() {
    this.emit(':tell', 'Hello World!');
  },
};

export function handler(event, context) {
  const alexa = alexaHandler(event, context);
  alexa.appId = 'amzn1.ask.skill.892358bf-175d-44ca-815e-331f0302d533';
  alexa.dynamoDBTableName = 'alexaLogEntryUserSettings';
  alexa.registerHandlers(handlers);
  alexa.execute();
}
