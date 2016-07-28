import { handler as alexaHandler } from 'alexa-sdk';

const handlers = {
  'LaunchRequest'() {
    this.emit(':tell', 'launched');
  },
  'HelloWorldIntent'() {
    this.emit(':tell', 'Hello World!');
  },
};

export function handler(event, context) {
  const alexa = alexaHandler(event, context);
  alexa.appId = 'amzn1.ask.skill.892358bf-175d-44ca-815e-331f0302d533';
  alexa.registerHandlers(handlers);
  alexa.execute();
}
