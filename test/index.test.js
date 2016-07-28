import { expect } from 'chai';

import { handler } from '../src';

function randomId() {
  const template = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
  return template.replace(/x/g, () => (Math.random() * 16 | 0).toString(16));
}

describe('handler', () => {
  let request;
  let response;
  const context = {
    succeed: resp => {
      response = resp;
    },
  };
  beforeEach(() => {
    request = {
      session: {
        sessionId: `amzn1.echo-api.session.${randomId()}`,
        attributes: {},
        user: {
          userId: `amzn1.ask.account.${randomId()}`,
        },
        application: {
          applicationId: 'amzn1.ask.skill.892358bf-175d-44ca-815e-331f0302d533',
        },
      },
      version: '1.0',
      request: {
        requestId: `amzn1.echo-api.request.${randomId()}`,
      },
    };
    response = null;
  });

  it('should launch', () => {
    request.request.type = 'LaunchRequest';
    handler(request, context);
    expect(response.response.outputSpeech.ssml).to.match(/launched/);
  });

  it('should hello world', () => {
    request.request.type = 'IntentRequest';
    request.request.intent = {
      name: 'HelloWorldIntent',
    };
    handler(request, context);
    expect(response.response.outputSpeech.ssml).to.match(/Hello World/);
  });
});
