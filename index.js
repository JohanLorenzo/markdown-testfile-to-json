'use strict';

var Promise = require('promise');
var readFile = Promise.denodeify(require('fs').readFile);
var parseMarkdown = require('./lib/parsers/markdown');
var errorHandler = require('./lib/error-handler');

module.exports = function(inputFilePath) {
  return readFile(inputFilePath, 'utf8').then(function(text) {
    var json = parseMarkdown(text);

    if (errorHandler.hasAnyError()) {
      errorHandler.setFileNameIfNotSet(inputFilePath);
      return Promise.reject(errorHandler.errors);
    }

    return Promise.resolve(json);
  });
};
