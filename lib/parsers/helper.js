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
        if (typeof lastTokenOfThisLevel === 'undefined') {
          throw new Error('"' + token.type + '" with the text "' + token.text +
            '" should not be before a "' + tokenType + '"');
        }

        lastTokenOfThisLevel.childrenTokens.push(token);
      }
    });
    return sortedTokens;
  }
};
