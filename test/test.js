/* eslint-disable no-console, func-names */
'use strict';

var fs = require('fs');
var nock = require('nock');
var assert = require('assert');

nock('https://news.ycombinator.com')
  .get('/')
  .reply(200, fs.readFileSync(__dirname + '/hn-reply.html'));

var getFrontPageHN = require('../');
var expectedOutput = require('./expected-output.json');

getFrontPageHN(function(err, posts) {
  if (err) { throw err; }

  assert.deepEqual(posts, expectedOutput);
});
