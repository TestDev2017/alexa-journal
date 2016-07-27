import { handler as alexaHandler } from 'alexa-sdk';

const handlers = {
  'LaunchRequest'() {
    this.emit(':tell', 'launched');
  },
};

export function handler(event, context) {
  const alexa = alexaHandler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
}
