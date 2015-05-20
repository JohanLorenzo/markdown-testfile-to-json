var assert = require('chai').assert;

// FIXME: you can't require/rewire the cli as it's not a node package
// This prevents the whole cli.js from being tested
//var rewire = require('rewire');
// var cli = rewire('../../cli');
describe.skip('cli', function() {

  it('should define a help message', function() {
    assert.ok(false);
  });

  it('should send the first argument to the main package', function() {
    assert.ok(false);
  });

  it('should output the json if everything went well', function() {
    assert.ok(false);
  });

  it('should output the errors if something went wrong', function() {
    assert.ok(false);
  });

  it('should support one single error rejected by the promise', function() {
    assert.ok(false);
  });

  describe('_ensureArray', function() {
    // var _ensureArray = cli.__get__('_ensureArray');
    var _ensureArray = function() {};

    it('should put and return an array around what is passed', function() {
      var object = { foo: 'bar' };
      assert.deepEqual(_ensureArray(object), [object]);
    });

    it('should return the array unchanged if an array is passed', function() {
      var array = ['foo'];
      assert.deepEqual(_ensureArray(array), array);
    });
  });
});
