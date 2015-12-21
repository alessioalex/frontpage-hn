/* eslint-disable no-console, func-names */
'use strict';

var getFrontPageHN = require('./');

getFrontPageHN(function(err, posts) {
  if (err) { throw err; }

  console.log(posts);
});

// Example output:
/*
  [{
    title: 'Deep Learning: An MIT Press Book in Preparation',
    postLink: 'http://goodfeli.github.io/dlbook/',
    commentsLink: 'https://news.ycombinator.com/item?id=10768440',
    comments: 20
  },
  ...
  ]
*/
