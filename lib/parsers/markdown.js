'use strict';

var marked = require('marked');
var helper = require('./helper');
var parseSuite = require('./suite');

module.exports = function(text){
  var lexer = new marked.Lexer();
  var tokens = lexer.lex(text);

  var suiteTokens = helper.sortTokensByHierarchy(tokens, 'heading', 1);
  var suites = suiteTokens.map(parseSuite);

  return suites;
};
