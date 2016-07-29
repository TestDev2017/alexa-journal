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
  'AMAZON.HelpIntent'() {
    const help = 'Your journal is a quick way to take timestamped notes. It isn\'t that accurate, but it\'s good enough to keep track of things. After you\'ve linked the account to Google Drive, the journal entries will show up either, in a single document, in a folder full of documents, or as rows on a spreadsheet. You can change this by saying, "save in a single document", "save in a folder", or "save in a spreadsheet". You can launch your journal, or it can start listening immediately. For example if you say, "Alexa, tell my journal I had five oranges for dinner." An entry will instantly appear in your journal.';
    this.emit(':tellWithCard', help, 'Help', help);
  },
  'AMAZON.StopIntent'() {
    this.emit(':tell', '');
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
  'Unhandled'() {
    this.emit('AMAZON.HelpIntent');
  },
};

export function handler(event, context) {
  const alexa = alexaHandler(event, context);
  alexa.appId = 'amzn1.ask.skill.892358bf-175d-44ca-815e-331f0302d533';
  alexa.dynamoDBTableName = 'alexaLogEntryUserSettings';
  alexa.registerHandlers(handlers);
  alexa.execute();
}
