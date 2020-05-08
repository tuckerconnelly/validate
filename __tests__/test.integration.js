const { validate, ValidateError } = require('../index');

it('throws proper errors', async () => {
  try {
    validate(
      {
        required: ['requiredProperty', 'nestedTest'],
        properties: {
          requiredProperty: { type: 'string' },
          emailFormat: { type: 'string', format: 'email' },
          emailFormatSpace: { type: 'string', format: 'email' },
          minLength: { type: 'string', minLength: 2 },
          maxLength: { type: 'string', maxLength: 3 },
          nestedTest: {
            required: ['deeplyNestedRequired'],
            properties: {
              deeplyNestedRequired: { type: 'string' },
              deeplyNestedString: { type: 'string' },
            },
          },
        },
      },
      {
        emailFormat: 'asdf',
        emailFormatSpace: '  asdf@asdf.com',
        minLength: '1',
        maxLength: '1234',
        nestedTest: {
          deeplyNestedString: 123,
        },
      }
    );
    expect(false).toBe(true, `validate() should've thrown.`);
  } catch (err) {
    if (!(err instanceof ValidateError)) console.error(err);
    expect(err.errors).toEqual([
      {
        title: 'Required property is required.',
        source: '/requiredProperty',
      },
      {
        title: 'Email format must be in email format.',
        source: '/emailFormat',
      },
      {
        title: 'Email format space must be in email format.',
        source: '/emailFormatSpace',
      },
      {
        title: 'Min length must be at least 2 characters long.',
        source: '/minLength',
      },
      {
        title: 'Max length must be less than 3 characters long.',
        source: '/maxLength',
      },
      {
        title: 'Deeply nested required is required.',
        source: '/nestedTest/deeplyNestedRequired',
      },
      {
        title: 'Deeply nested string must be a string.',
        source: '/nestedTest/deeplyNestedString',
      },
    ]);
  }
});
