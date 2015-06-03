'use strict';

var parseTestcase = require('./testcase').parse;
var helper = require('./helper');
var Suite = require('../model/suite');
var errorHandler = require('../error-handler');
var _ = require('lodash');


module.exports = function(suiteToken) {
  var suiteVariables;
  var childrenTokens = suiteToken.childrenTokens;

  if (_isFirstTokenTable(childrenTokens)) {
    suiteVariables = _getSuiteVariablesFromTable(childrenTokens[0]);
    childrenTokens = _.drop(suiteToken.childrenTokens);
  }

  var testcasesTokens = helper.sortTokensByHierarchy(childrenTokens, 'heading', 2);
  var testcases = testcasesTokens.map(parseTestcase);
  return new Suite(suiteToken.name, testcases, suiteVariables);
};

function _isFirstTokenTable(childrenTokens) {
  return childrenTokens.length > 0 && childrenTokens[0].type === 'table';
}

function _getSuiteVariablesFromTable(token) {
  var suiteVariables = {};

  token.cells.forEach(function(row) {
    var testId = row[0];

    if (suiteVariables[testId]) {
      errorHandler.add(new Error('"' + testId + '" has already been used in this table'));
    }
    var testcaseVariables = _getTestcaseVariablesFromRow(row, token.header);
    suiteVariables[testId] = testcaseVariables;
  });

  return suiteVariables;
}

function _getTestcaseVariablesFromRow(row, header) {
  var testcaseVariables = [];
  var FIRST_COLUMN_THAT_IS_NOT_AN_ID = 1;

  for (var i = FIRST_COLUMN_THAT_IS_NOT_AN_ID; i < row.length; i++) {
    var cellContent = row[i].trim();
    var suiteVariableName = header[i];

    if (typeof suiteVariableName === 'undefined') {
      errorHandler.add(new Error('There are not enough colums on the first row'));
    }

    if (cellContent === 'x') {
      testcaseVariables.push(suiteVariableName);
    } else if (cellContent !== '') {
      errorHandler.add(new Error('"' + cellContent + '" is not a valid cell content (case sensitive)'));
    }
  }

  return testcaseVariables;
}
