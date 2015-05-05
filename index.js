'use strict';
var Promise = require('promise');
var readFile = Promise.denodeify(require('fs').readFile);
var parseMarkdown = require('./lib/parsers/markdown');

module.exports = function (inputFilePath) {
  readFile(inputFilePath, 'utf8').then(function(text) {
    var json = parseMarkdown(text);
    console.log(JSON.stringify(json));
  });
};
