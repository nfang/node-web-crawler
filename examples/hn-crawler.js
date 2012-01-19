// A simple example to fetch titles from news.ycombinator.com
var Crawler = require('../crawler.js').Crawler
  , hnCrawler = new Crawler({
    callback: function () {
      var $ = this.jQuery
        , titleElements = $('td.title')
        , titles = [];
      
      $.each(titleElements, function (index, value) {
        var titleLink = $(value).children('a');
        if (titleLink.length !== 0)
          titles.push(titleLink.text());
      });

      console.log(titles);
    }
  });

hnCrawler.enqueue('http://news.ycombinator.com');