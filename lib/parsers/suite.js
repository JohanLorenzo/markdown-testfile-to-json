'use strict';

var parseTestcase = require('./testcase').parse;
var helper = require('./helper');
var Suite = require('../model/suite');

module.exports = function(suiteToken) {
  var testcasesTokens = helper.sortTokensByHierarchy(suiteToken.childrenTokens, 'heading', 3);
  var testcases = testcasesTokens.map(parseTestcase);
  return new Suite(suiteToken.name, testcases);
};
