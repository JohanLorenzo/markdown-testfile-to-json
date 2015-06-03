'use strict';

var errorHandler = require('../error-handler');
var Helper = require('./helper');

function Suite(name, testcases, variables) {
  this.name = Suite._sanitizeName(name);
  this.testcases = Suite._sanitizeTestcases(testcases);

  if (Helper.isOptionalFieldDefined(variables)) {
    this.variables = variables;
  }
}

Suite._sanitizeName = function(candidate) {
  try {
    candidate = candidate.trim();
  } catch(e) {
    errorHandler.add(new Error('"' + candidate + '" must be a string'));
  }
  return candidate;
};

Suite._sanitizeTestcases = function(candidate) {
  if (!(candidate instanceof Array) || candidate.length < 1) {
    errorHandler.add(new Error('There are no test cases defined.'));
  }
  return candidate;
};

module.exports = Suite;
