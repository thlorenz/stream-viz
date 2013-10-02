# stream-viz 

[![testling badge](https://ci.testling.com/thlorenz/stream-viz.png)](https://ci.testling.com/thlorenz/stream-viz)

Visualizes a stream in the browser.

[Play with it live](http://thlorenz.github.io/stream-viz/).

```js
var sviz = require('stream-viz')
var readable = getSomeReadable()
  , writable = getSomeWritable()

sviz(readable);
sviz(writable);

readable.pipe(writable);
```

## Running the Examples

After you installed `stream-viz` please do the following:

`npm explore stream-viz && npm install`

### Run the Full Example

`npm start`

## Run smaller examples

`npm run line-chart|gauge|tabject|ticker

More coming.

### Note 

When creating your own visualization, you need to include specific `css` properly render the visualized streams. More
documentation on how to set up a stream visualization properly is coming.

For now please consult [this three stream visualization
example](https://github.com/thlorenz/stream-viz/tree/master/example/overview) or consult any of the simpler examples
found [here](https://github.com/thlorenz/stream-viz/tree/master/example/)

## Installation

    npm install stream-viz

## API


## License

MIT
