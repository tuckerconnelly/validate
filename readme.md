***Early Version***

# validate

Validates json schemas and outputs [json-api error objects](https://jsonapi.org/format/#error-objects).

## Usage

```
npm i @tuckerconnelly/validate
```

```js
const validate = require('@tuckerconnelly/validate');

try {
  validate(
    {
      properties: {
        title: 'id',
        id: { type: integer }
      }
    },
    { notId: 'A string' }
  )
} catch (err) {
  console.error(err.errors);

  // [
  //   {
  //     title: 'Expected id to be a string.'
  //     source: '/id'
  //   }
  // ]
}
```

## License

MIT
