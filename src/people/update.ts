'use strict';

import * as AWS from 'aws-sdk';

import { isAuthenticated, isAuthorized } from './authorizer'
import { Person } from './Person';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const update = (event: LambdaEvent<{ id: string }>, context: Context, callback: LambdaCallback) => {
  if (!isAuthenticated(event.headers.Authorization, event.requestContext.authorizer.claims.iss)) {
    const response = {
      statusCode: 401,
      body: JSON.stringify('Not authenticated')
    }
    callback(null, response);
    return;
  }
  if (!isAuthorized(event.requestContext.authorizer.claims['cognito:groups'], 'tester')) {
    const response = {
      statusCode: 403,
      body: JSON.stringify('Not authorized')
    }
    callback(null, response);
    return;
  }

  const person = new Person(dynamoDb, event.requestContext.authorizer.claims.email);
  person.update(event.pathParameters.id, JSON.parse(event.body), (error, result) => {
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t update the person item.'));
      return;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(result)
    }
    callback(null, response);
  });
}