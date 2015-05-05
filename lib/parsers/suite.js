'use strict';

var parseTestcase = require('./testcase');
var helper = require('./helper');

module.exports = function(suite) {
  var tokens = suite.followingTokens;
  var testcasesTokens = helper.sortTokensByHierarchy(tokens, 'heading', 3);
  var testcases = helper.parseTokens(testcasesTokens, parseTestcase);
  return testcases;
};
