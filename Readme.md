
# x-ray-phantom

  phantom driver for [x-ray](https://github.com/lapwinglabs/x-ray).

## Installation

```
npm install x-ray-phantom
```

## Usage

```js
var phantom = require('x-ray-phantom')

xray('http://google.com')
  .driver(phantom(runner))
  .select([{
    $root: '.result',
    title: '.title',
    link: 'a[href]'
  }])
  .write('out.json');

function runner(ctx, nightmare) {
  if (ctx.url == 'http://google.com') {
    
  }
}
```

## API

#### xray#request(url, fn)

Make the request using PhantomJS

#### Methods from Nightmare

This driver also adds the following methods from [nightmare](https://github.com/segmentio/nightmare):

- xray#useragent
- xray#viewport
- xray#scrollTo
- xray#forward
- xray#refresh
- xray#upload
- xray#click
- xray#check
- xray#type
- xray#back
- xray#wait
- xray#evaluate

Check their readme for usage details.

## Test

```
npm install
make test
```

## License

(The MIT License)

Copyright (c) 2015 Matthew Mueller &lt;matt@lapwinglabs.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
