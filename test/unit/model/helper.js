'use strict';

var assert = require('chai').assert;
var Helper = require('../../../lib/model/helper');

describe('Helper', function() {


  describe('isOptionalFieldDefined', function() {
    it('should return true when called with an argument', function() {
      assert.ok(Helper.isOptionalFieldDefined(''));
    });

    it('should return false when called with no argument', function() {
      assert.notOk(Helper.isOptionalFieldDefined());
    });

    it('should return false when called with an argument set to undefined', function() {
      var object = {};
      assert.notOk(Helper.isOptionalFieldDefined(object.undefinedArgument));
    });
  });

});
