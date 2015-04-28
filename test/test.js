'use strict';
var assert = require('assert');
var markdownTestfileToJson = require('../');

describe('markdown-testfile-to-json node module', function () {
  it('must have at least one test', function () {
    markdownTestfileToJson();
    assert(false, 'I was too lazy to write any tests. Shame on me.');
  });
});
