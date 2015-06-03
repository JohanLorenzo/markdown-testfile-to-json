'use strict';

var assert = require('chai').assert;
var mainPackage = require('../../index');

describe('The main package', function() {

  it('should handle the suite variables', function() {
    return mainPackage(['test/integration/suite-variables.md']).then(function(actualResult) {
      assert.deepEqual(actualResult, [{
        "name": "SMS suite",
        "testcases": [{
          "id": "idone",
          "instructions": "Instructions",
          "state": "active",
          "bug": 1,
          "userStory": 1,
          "variablesFromSuite": ["var1", "var3"]
        }, {
          "id": "idtwo",
          "instructions": "Instructions 2",
          "state": "disabled",
          "bug": 2,
          "userStory": 2,
          "variablesFromSuite": ["var1"]
        }]
      }]);
    });
  });

});
