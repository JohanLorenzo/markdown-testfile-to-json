#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coveralls-image]][coveralls-url]

> A parser which transform manual tests in Mardown to JSON

## As a command line tool
```sh
$ ./cli.js test-formated-file.md
```

```sh
$ npm install --global markdown-testfile-to-json
$ markdown-testfile-to-json --help
```

## As a library

### Install

```sh
$ npm install --save markdown-testfile-to-json
```

### Usage

```js
var markdownTestfileToJson = require('markdown-testfile-to-json');

markdownTestfileToJson(inputFile);
```

## License

MIT


[npm-image]: https://badge.fury.io/js/markdown-testfile-to-json.svg
[npm-url]: https://npmjs.org/package/markdown-testfile-to-json
[travis-image]: https://travis-ci.org/JohanLorenzo/markdown-testfile-to-json.svg?branch=master
[travis-url]: https://travis-ci.org/JohanLorenzo/markdown-testfile-to-json
[daviddm-image]: https://david-dm.org/JohanLorenzo/markdown-testfile-to-json.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/JohanLorenzo/markdown-testfile-to-json
[coveralls-image]: https://coveralls.io/repos/JohanLorenzo/markdown-testfile-to-json/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/r/JohanLorenzo/markdown-testfile-to-json?branch=master
