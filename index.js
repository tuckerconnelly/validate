const debug = require('debug')('validate');
const Ajv = require('ajv');
const _ = require('lodash');
const a = require('indefinite');

const ajv = new Ajv({
  allErrors: true,
  verbose: true,
  errorDataPath: 'property',
});

// Adapted from MDN example: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
class ValidateError extends Error {
  constructor(errors, ...errorParams) {
    super(...errorParams);
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidateError);
    }

    this.name = 'ValidateError';
    this.errors = errors;
  }
}

exports.ValidateError = ValidateError;

function validate(schema, data) {
  if (!data) throw new Error(`No data passed as second parameter to validate(schema, data).`)

  const valid = ajv.validate(schema, data);
  if (valid) return null;

  debug({ ajvErrors: ajv.errors });

  const errors = ajv.errors.map((error) => {
    let title = error.message;
    const name = _.capitalize(_.startCase(error.dataPath.split('.').pop()));
    const source = error.dataPath.replace(/\./g, '/');

    if (error.keyword === 'required') {
      return {
        title: `${name} is required.`,
        source,
      };
    }

    if (error.keyword === 'type') {
      return {
        title: `${name} must be ${a(error.params.type)}.`,
        source,
      };
    }

    if (error.keyword === 'format') {
      return {
        title: `${name} must be in ${error.params.format} format.`,
        source,
      };
    }

    if (error.keyword === 'minLength') {
      return {
        title: `${name} must be at least ${error.params.limit} characters long.`,
        source,
      };
    }

    if (error.keyword === 'maxLength') {
      return {
        title: `${name} must be less than ${error.params.limit} characters long.`,
        source,
      };
    }

    return { title, source };
  });

  throw new ValidateError(errors);
}

exports.validate = validate;
