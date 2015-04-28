#!/usr/bin/env node
'use strict';
var meow = require('meow');
var markdownTestfileToJson = require('./');

var cli = meow({
  help: [
    'Usage',
    '  markdown-testfile-to-json <input>',
    '',
    'Example',
    '  markdown-testfile-to-json Unicorn'
  ].join('\n')
});

markdownTestfileToJson(cli.input[0]);
