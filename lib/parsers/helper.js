'use strict';

var _ = require('lodash');

module.exports = {
  sortTokensByHierarchy: function(tokens, tokenType, tokenDepth) {
    var sortedTokens = [];

    tokens.forEach(function(token) {

      if(token.type === tokenType && token.depth === tokenDepth) {
        sortedTokens.push({
          name: token.text,
          childrenTokens: []
        });
      } else {
        var lastTokenOfThisLevel = _.last(sortedTokens);
        lastTokenOfThisLevel.childrenTokens.push(token);
      }
    });

    return sortedTokens;
  }
};
