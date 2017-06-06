import * as AWS from 'aws-sdk';
import * as uuid from 'uuid';

import { table } from './config'
import { validate } from './validator'

export class Person {
  constructor(private db: AWS.DynamoDB.DocumentClient, private userEmail: string) { }

  public get = (id: string, callback: (error: Error, person?: TPerson) => void) => {
    const params = {
      TableName: table,
      Key: {
        id
      }
    };

    this.db.get(params, (error, result) => {
      if (error) {
        console.error(error);
        callback(new Error('Couldn\'t fetch the person item.'));
        return;
      }

      const person = result.Item as TPerson;

      callback(null, person);
    });
  }

  public list = (callback: (error: Error, person?: TPerson[]) => void) => {
    const params = {
      TableName: table
    };

    this.db.scan(params, (error, result) => {
      if (error) {
        console.error(error);
        callback(new Error('Couldn\'t fetch the people.'));
        return;
      }

      callback(null, result.Items as TPerson[]);
    });
  }

  public create = (data: TPerson, callback: (error: Error, person?: TPerson) => void) => {
    if (!validate(data)) {
      console.error('Validation Failed');
      callback(new Error('Couldn\'t create the person item.'));
      return;
    }

    const timestamp = new Date().getTime();
    const params = {
      TableName: table,
      Item: {
        ...data,
        id: uuid.v4(),
        user: this.userEmail,
        createdAt: timestamp,
        updatedAt: timestamp
      }
    };

    this.db.put(params, (error, result) => {
      if (error) {
        console.error(error);
        callback(new Error('Couldn\'t create the person item.'));
        return;
      }

      callback(null, params.Item as any as TPerson);
    });
  }

  public update = (id: string, person: TPerson, callback: (error: Error, person?: TPerson) => void) => {
    const data = {
      ...person,
      id,
    };

    if (!validate(data)) {
      console.error('Validation Failed');
      callback(new Error('Couldn\'t create the person item.'));
      return;
    }

    const timestamp = new Date().getTime();
    const params = {
      TableName: table,
      Item: {
        ...data,
        updateAt: timestamp
      }
    };

    this.db.put(params, (error, result) => {
      if (error) {
        console.error(error);
        callback(new Error('Couldn\'t create the person item.'));
        return;
      }

      callback(null, result.Attributes as TPerson);
    });
  }
}