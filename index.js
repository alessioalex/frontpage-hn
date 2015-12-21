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

          news.push({
            title: title,
            postLink: el.attr('href'),
            commentsLink: 'https://news.ycombinator.com/' + commentsEl.attr('href'),
            comments: parseInt(commentsEl.text(), 10) || 0
          });
        }
      });

      cb(null, news);
    }
  }));
}

module.exports = getFrontPageHN;
