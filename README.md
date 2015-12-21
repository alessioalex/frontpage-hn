# frontpage-hn

Retrieves the stories on the front page of Hacker News in JSON format.

[![Build Status](https://travis-ci.org/alessioalex/frontpage-hn.svg)](https://travis-ci.org/alessioalex/frontpage-hn)

## usage

```js
var getFrontPageHN = require('frontpage-hn');

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
```

## tests

```bash
npm test
```

## license

[MIT](http://alessioalex.mit-license.org/)
