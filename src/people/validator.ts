import * as Ajv from 'ajv';

const schema = {
  "properties": {
    "firstName": { "type": "string", "minLength": 3, "maxLength": 128 },
    "lastName": { "type": "string", "minLength": 3, "maxLength": 128 },
    "email": { "type": "string", "format": "email" },
  },
  "required": ["firstName", "lastName", "email"],
  "additionalProperties": false
};

const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
var validator = ajv.compile(schema);

export const validate = (obj: any): obj is TPerson => {
  var valid = validator(obj);
  if (!valid) {
    console.log(validator.errors);

    return false;
  }


  return true;
}
