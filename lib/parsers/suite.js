'use strict';

var parseTestcase = require('./testcase').parse;
var helper = require('./helper');

module.exports = function(suite) {
  var tokens = suite.followingTokens;
  var testcasesTokens = helper.sortTokensByHierarchy(tokens, 'heading', 3);
  var testcases = testcasesTokens.map(parseTestcase);
  return testcases;
};
