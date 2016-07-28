import { expect } from 'chai';

import { handler } from '../src';

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
        sessionId: `session${Math.floor(Math.random() * 1000)}`,
        attributes: {},
        user: {
          userId: `user${Math.floor(Math.random() * 1000)}`,
        },
        application: {
          applicationId: 'amzn1.ask.skill.892358bf-175d-44ca-815e-331f0302d533',
        },
      },
      version: '1.0',
      request: {
        requestId: `request${Math.floor(Math.random() * 1000)}`,
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
