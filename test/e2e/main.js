'use strict';
var assert = require('assert');

describe('cli', function () {
  it('should read a file a Markdown file and output the JSON', function (done) {
    var exec = require('child_process').exec;
    exec("./cli.js test/e2e/default.md", function(error, stdout) {

      var expectedResult = JSON.stringify([ { id: 'fxos.func.sanity.launch-contacts',
          bug: '2',
          userStory: '1',
          state: 'draft',
          instructions: 'Launch contacts! this is an updated version' },
        { id: 'fxos.func.sanity.launch-music',
          bug: '3',
          userStory: '3',
          state: 'disabled',
          instructions: 'Launch music' },
        { id: 'fxos.func.sanity.launch-sms-repeated',
          bug: '3',
          userStory: '3',
          state: 'xfail',
          instructions: 'Launch SMS and measure elapsed time\nDo it again.\nAnd again.' },
        { id: 'fxos.func.parameterized.test',
          instructions: 'Launch the dialog, insert :val1, :val2, :val3 and hit enter.',
          variables: [{ID:'id1',val1:'a',val2:'1',val3:'one one'},{ID:'id2',val1:'b',val2:'2',val3:'two two'}]},
        { id: 'fxos.func.sanity.launch-rocketbar',
          bug: '4',
          userStory: '3',
          state: 'draft',
          instructions: 'Launch rocketbar' } ]);
      expectedResult += '\n';
      assert.deepEqual(stdout, expectedResult);

      done();
    });
  });
});
