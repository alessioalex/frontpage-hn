/* eslint-disable no-console, func-names */
'use strict';

const { getHNPosts, getHNPostsAsPromised } = require('./');

// example 1: standard HN front page
// comment/uncomment the following line
/*
getHNPosts(function(err, posts) {
  if (err) { throw err; }

  console.log(posts);
});
// */

// example 2: order by 'score' descending (and using options)
// (defaults to regular HN position, can also be set to 'comments')
// 
// comment/uncomment the following line
/*
getHNPosts({ orderBy: 'score' }, function(err, posts) {
  if (err) { throw err; }

  console.log(posts);
});
// */

// example 3: using async await with Promises instead of callbacks
// 
// comment/uncomment the following line
// /*
(async function() {
  try {
    const posts = await getHNPostsAsPromised({ orderBy: 'comments' });
    console.log(posts);
  } catch (err) {
    console.error('oh noes, something bad happened while getting the HN posts :/')
    throw err;
  }
}());
// */


// Example output:

// 30 items that look like the following ->
/*
  [{
    title: 'Deep Learning: An MIT Press Book in Preparation',
    postLink: 'http://goodfeli.github.io/dlbook/',
    commentsLink: 'https://news.ycombinator.com/item?id=10768440',
    score: 465,
    comments: 20
  },
  ...
  ]
*/
