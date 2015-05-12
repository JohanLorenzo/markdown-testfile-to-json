'use strict';

var assert = require('assert');

describe('cli', function() {
  it('should read a file a Markdown file and output the JSON', function(done) {
    var exec = require('child_process').exec;
    exec("./cli.js test/e2e/default.md", function(error, stdout) {

      var expectedResult = JSON.stringify({
        name: 'Launch suite',
        testcases: [{
          id: 'fxos.func.sanity.launch_contacts',
          instructions: 'Launch contacts! this is an updated version',
          state: 'draft',
          bug: 2,
          userStory: 1
        }, {
          id: 'fxos.func.sanity.launch_music',
          instructions: 'Launch music',
          state: 'disabled',
          bug: 3,
          userStory: 3
        }, {
          id: 'fxos.func.sanity.launch_sms_repeated',
          instructions: 'Launch SMS and measure elapsed time\nDo it again.\nAnd again.',
          state: 'xfail',
          bug: 3,
          userStory: 3
        }, {
          id: 'fxos.func.parameterized.test',
          instructions: 'Launch the dialog, insert :val1, :val2, :val3 and hit enter.',
          state: 'active',
          variables: [{
            ID: 'id1',
            val1: 'a',
            val2: '1',
            val3: 'one one'
          }, {
            ID: 'id2',
            val1: 'b',
            val2: '2',
            val3: 'two two'
          }]
        }, {
          id: 'fxos.func.sanity.launch_rocketbar',
          instructions: 'Launch rocketbar',
          state: 'draft',
          bug: 4,
          userStory: 3
        }]
      });
      expectedResult += '\n';
      assert.deepEqual(stdout, expectedResult);

      done();
    });
  });
});
