'use strict';

var _ = require('lodash');

module.exports = {
  sortTokensByHierarchy: function(tokens, tokenType, tokenDepth) {
    var sortedTokens = [];

    tokens.forEach(function(token) {

      if(token.type === tokenType && token.depth === tokenDepth) {
        sortedTokens.push({
          name: token.text,
          followingTokens: []
        });
      } else {
        var metaSuiteToken = _.last(sortedTokens);
        metaSuiteToken.followingTokens.push(token);
      }
    });

    return sortedTokens;
  }
};
