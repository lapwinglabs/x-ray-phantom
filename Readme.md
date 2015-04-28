
# x-ray-phantom

  phantom driver for [x-ray](https://github.com/lapwinglabs/x-ray).

## Installation

```
npm install x-ray-phantom
```

## Usage

```js
var phantom = require('x-ray-phantom');
var Xray = require('x-ray');

var x = Xray()
  .driver(phantom());

x('http://google.com', 'title')(function(err, str) {
  if (err) return done(err);
  assert.equal('Google', str);
  done();
})
```

## API

### phantom([options|fn], [fn])

Initialize the phantom driver with `options` being passed to Nightmare and
an optional custom `fn` with the signature `function(nightmare, done)`.

## Test

```
npm install
make test
```

## License

MIT
