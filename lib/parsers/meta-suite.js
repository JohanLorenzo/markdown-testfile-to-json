'use strict';

var parseSuite = require('./suite');
var helper = require('./helper');

module.exports = function(metaSuite) {
  var tokens = metaSuite.followingTokens;
  var suiteTokens = helper.sortTokensByHierarchy(tokens, 'heading', 2);
  var suites = helper.parseTokens(suiteTokens, parseSuite);
  // FIXME This hack
  return suites[0];
};
