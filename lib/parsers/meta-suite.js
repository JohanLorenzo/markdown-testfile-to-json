'use strict';

var parseSuite = require('./suite');
var helper = require('./helper');
var MetaSuite = require('../model/meta-suite');

module.exports = function(metaSuiteToken) {
  var suiteTokens = helper.sortTokensByHierarchy(metaSuiteToken.childrenTokens, 'heading', 2);
  var suites = suiteTokens.map(parseSuite);
  return new MetaSuite(metaSuiteToken.name, suites);
};
