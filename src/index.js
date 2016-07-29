import { handler as alexaHandler } from 'alexa-sdk';

const handlers = {
  'LaunchRequest'() {
    this.emit(':tell', 'launched');
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
