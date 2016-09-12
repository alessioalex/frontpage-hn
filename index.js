'use strict';

var get = require('simple-get').concat;
var cheerio = require('cheerio');
var errTo = require('errto');
var Err = require('custom-err');

function getFrontPageHN(cb) {
  get({
    url: 'https://news.ycombinator.com/',
    headers: {
      Accept: '*/*',
      Connection: 'close',
      'User-Agent': 'frontpage-hn'
    }
  }, errTo(cb, function handleResponse(data, res) {
    if (res.statusCode !== 200) {
      cb(Err('HN request returned bad status code', {
        code: res.statusCode,
        responseBody: data,
        responseHeaders: res.headers
      }));
    } else {
      var news = [];
      var $ = cheerio.load(data.toString('utf8'));

      $('.title > a').each(function parseData() {
        var el = $(this);
        var title = el.text();

        // last link is 'More' so we're not interested
        if (!/^More$/i.test(title)) {
          var commentsEl = el.parents('.athing').next().find('.subtext a').last();
          var commentsLink = commentsEl.attr('href');

          // if it doesn't have a comments link it's not of value (hiring posts etc)
          if (!commentsLink || /^hide/.test(commentsLink)) { return; }

          var tmp = commentsLink.match(/item\?id=(.*)/);
          var postId = 0;

          if (tmp && tmp[1]) {
            postId = parseInt(tmp[1], 10);
          } else {
            throw new Error('Cannot get postId for ' + title + ': ' + commentsLink);
          }

          news.push({
            id: postId,
            title: title,
            postLink: el.attr('href'),
            commentsLink: 'https://news.ycombinator.com/' + commentsLink,
            comments: parseInt(commentsEl.text(), 10) || 0
          });
        }
      });

      cb(null, news);
    }
  }));
}

module.exports = getFrontPageHN;
