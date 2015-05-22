'use strict';

var Promise = require('promise');
var readFile = Promise.denodeify(require('fs').readFile);
var parseMarkdown = require('./lib/parsers/markdown');
var errorHandler = require('./lib/error-handler');
var _ = require('lodash');

module.exports = function(inputFilePaths) {
  var promises = inputFilePaths.map(_handleSingleFilePath);

  return Promise.all(promises).then(function(results) {

    // Sometimes some promises have failed
    if (errorHandler.hasAnyError()) {
      return Promise.reject(errorHandler.errors);
    } else {
      var validSuites = _.flatten(results);
      var mergedSuites = _mergeSuites(validSuites);
      return Promise.resolve(mergedSuites);
    }

  }).catch(function() {
    return Promise.reject(errorHandler.errors);
  });
};

function _handleSingleFilePath(inputFilePath) {
  return readFile(inputFilePath, 'utf8').then(function(text) {
    var json = parseMarkdown(text);
    if (errorHandler.hasAnyErrorWithoutFileNameSet()) {
      errorHandler.setFileNameIfNotSet(inputFilePath);
      // We don't specify the reasons because, all the errors we'll need are
      // in the error handler
      return Promise.reject();
    }
    return Promise.resolve(json);
  });
}

function _mergeSuites(nonMutableSuites) {
  var mutableSuites = nonMutableSuites.slice();
  var mergedSuites = [];

  while (mutableSuites.length > 0) {
    var originalSuite = _.pullAt(mutableSuites, 0)[0];

    for (var j = 0; j < mutableSuites.length;) {
      if (originalSuite.name !== mutableSuites[j].name) {
        j++;
      } else {
        var duplicateSuite = mutableSuites[j];
        originalSuite = _.merge(originalSuite, duplicateSuite, _mergeArraysCustomizer);
        _.pullAt(mutableSuites, j);
      }
    }

    mergedSuites.push(originalSuite);
  }

  return mergedSuites;
}

function _mergeArraysCustomizer(a, b) {
  if (_.isArray(a)) {
    return a.concat(b);
  }
}
