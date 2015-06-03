'use strict';

var Promise = require('promise');
var readFile = Promise.denodeify(require('fs').readFile);
var parseMarkdown = require('./lib/parsers/markdown');
var errorHandler = require('./lib/error-handler');
var _ = require('lodash');

module.exports = function(inputFilePaths) {
  var promises = inputFilePaths.map(_handleSingleFilePath);

  return Promise.all(promises).then(function(suitesPerFile) {

    var allSuites = _.flatten(suitesPerFile);
    var mergedSuites = _mergeSuites(allSuites);
    _linkSuiteVariables(mergedSuites);

    // Sometimes some promises have failed
    if (errorHandler.hasAnyError()) {
      return Promise.reject(errorHandler.errors);
    } else {
      return Promise.resolve(mergedSuites);
    }

  }).catch(function() {
    return Promise.reject(errorHandler.errors);
  });
};

function _linkSuiteVariables(mergedSuites) {
  mergedSuites.forEach(function(suite) {
    if(typeof suite.variables !== 'undefined') {
      _linkSuiteVariablesToTestcases(suite.variables, suite.testcases);
      delete suite.variables;
    }
  });
}

function _linkSuiteVariablesToTestcases(suiteVariables, testcases) {
  testcases.forEach(function(testcase) {
    var testcaseVariables = suiteVariables[testcase.id];

    if (typeof testcaseVariables === 'undefined') {
      errorHandler.add(new Error('The id "' + testcase.id + '" mentioned in the table is not defined in the suite'));
    } else {
      testcase.variablesFromSuite = testcaseVariables;
    }
  });
}

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
