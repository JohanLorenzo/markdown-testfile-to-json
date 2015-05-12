'use strict';

var marked = require('marked');
var helper = require('./helper');
var parseMetaSuite = require('./meta-suite');

module.exports = function(text){
  var lexer = new marked.Lexer();
  var tokens = lexer.lex(text);

  var metaSuiteTokens = helper.sortTokensByHierarchy(tokens, 'heading', 1);
  var metaSuites = metaSuiteTokens.map(parseMetaSuite);

  // FIXME This hack
  return metaSuites[0];
};
