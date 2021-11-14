'use strict';

const get = require('simple-get').concat;
const cheerio = require('cheerio');

const hnStartTime = new Date('2007-02-19').getTime();
const currentDate = new Date().getTime();

function isValidHnDate(yyyymmdd) {
  const hnDay = new Date(yyyymmdd).getTime();

  return hnStartTime <= hnDay && hnDay <= currentDate;
}

// custom field can be one of 'score' or 'comments'
// it defaults to 'position' in which case it doesn't
// enter this function
function orderBy(news, field) {
  const secondaryField = field === 'score' ? 'comments' : 'score';

  return news.sort(function(a, b) {
    if (a[field] > b[field]) { return -1; }
    if (a[field] < b[field]) { return 1; }

    if (a[secondaryField] > b[secondaryField]) { return -1; }
    if (a[secondaryField] < b[secondaryField]) { return 1; }

    return 0;
  });
}

function getHNPosts(options, cb) {
  let done, opts;

  if (typeof options === 'function') {
    done = options;
    opts = {};
  } else {
    opts = options;
    done = cb;
  }

  if (opts?.orderBy && ['score', 'comments'].includes(opts.orderBy) === false) {
    throw new Error('orderBy property can only be one of "score" or "comments", if you don\'t specify it then it defaults to "position"');
  }

  let hnUrl = 'https://news.ycombinator.com/';

  if (opts?.day && !isValidHnDate(opts.day)) {
    throw new Error('invalid HN day option');
  } else if (opts?.day) {
    hnUrl = `https://news.ycombinator.com/front?day=${opts.day}`;
  }

  get({
    url: hnUrl,
    headers: {
      Accept: '*/*',
      Connection: 'close',
      'User-Agent': 'frontpage-hn'
    }
  }, function handleResponse(err, data, res) {
    if (err) {
      const e = new Error(`Could not retrieve HN posts - GET ${hnUrl}`);
      // https://github.com/tc39/proposal-error-cause
      e.cause = err;
      return done(e);
    }

    if (res.statusCode !== 200) {
      const error = new Error(`Received HTTP code ${res.statusCode} for GET ${hnUrl}`);
      error.statusCode = res.statusCode;
      error.headers = res.headers;
      error.body = res.body;

      return done(error);
    }

    let news = [];
    const $ = cheerio.load(data.toString('utf8'));

    $('.title > a').each(function parseData(position, element) {
      const el = $(element);
      const title = el.text();

      // last link is 'More' so we're not interested
      if (!/^More$/i.test(title)) {
        const athing = el.parents('.athing');
        const scoreAndCommentsEl = athing.next().find('.subtext');
        const score = parseInt(scoreAndCommentsEl.find('.score').text(), 10);
        const commentsEl = scoreAndCommentsEl.find('a').last();
        const commentsLink = commentsEl.attr('href');
        const id = athing.attr('id');

        news.push({
          position: position + 1,
          id,
          score: score || null, // hiring posts don't have score
          title,
          postLink: el.attr('href'),
          commentsLink:
            (commentsLink === `hide?id=${id}&goto=news`)
              ? null // hiring posts have no comments
              : `https://news.ycombinator.com/${commentsLink}`,
          comments: parseInt(commentsEl.text(), 10) || 0
        });
      }
    });

    news = opts.orderBy ? orderBy(news, opts.orderBy) : news;

    done(null, news);
  });
}

function getHNPostsAsPromised(opts = {}) {
  return new Promise(function getPostsAsPromised(resolve, reject) {
    getHNPosts(opts, function hnPostsCb(err, posts) {
      if (err) {
        return reject(err);
      }

      resolve(posts);
    });
  });
}

module.exports = {
  getHNPosts,
  getHNPostsAsPromised
};
