'use strict';

import * as AWS from 'aws-sdk';

import { Person } from './Person';
import { isAuthenticated, isAuthorized } from './authorizer'

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const create = (event: LambdaEvent<{}>, context: Context, callback: LambdaCallback) => {
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
  person.create(JSON.parse(event.body), (error, result) => {
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t create the person item.'));
      return;
    }
    
    const response = {
      statusCode: 200,
      body: JSON.stringify(result)
    }
    callback(null, response);
  });
}