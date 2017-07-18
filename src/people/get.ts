'use strict';

import * as AWS from 'aws-sdk';

import { Person } from './Person';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const apiUrl = 'https://api.aws.daigeb.ch';

export const get = (event: LambdaEvent<{ id: string }>, context: Context, callback: LambdaCallback) => {
  const person = new Person(dynamoDb, event.requestContext.authorizer.email);

  person.get(event.pathParameters.id, (error, person) => {
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t fetch the person item.'));
      return;
    }

    const response: HttpResponse = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(person)
    };
    callback(null, response);
  });
}
