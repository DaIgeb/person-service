'use strict';

import * as AWS from 'aws-sdk';

import { Person } from './Person';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const list = (event: LambdaEvent<{}>, context: Context, callback: LambdaCallback) => {
  const person = new Person(dynamoDb, event.requestContext.authorizer.email);

  person.list((error, result) => {
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t fetch the people.'));
      return;
    }

    const response: HttpResponse = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(result)
    }
    callback(null, response);
  });
}
