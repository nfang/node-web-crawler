var request = require('request')
  , jsdom = require('jsdom');

var Crawler = function (config, queue) {
  this.debug = config.debug || false;
  this.defaultCallback = config.callback || function() {};
  this.queue = [];
  if (queue && queue instanceof Array && queue.length !== 0) 
    this.enqueue(queue);
}

Crawler.prototype.enqueue = function (target) {
  if (!target) throw new Error('Target cannot be null.');

  if (this.debug) console.log('[debug]: target: ', target);

  if (target instanceof Array) {
    for (var i = target.length - 1; i >= 0; i--) {
      this.enqueue(target[i]);
    };
    return;
  }

  if (typeof target === 'string') {
    this.queue.push({ 
      url: target
      , defaultCallback: this.defaultCallback 
    });
  } else {
    target.defaultCallback = this.defaultCallback;
    this.queue.push(target);
  }
  
  this.crawl();
}

Crawler.prototype.crawl = function () {
  var item = {};

  while (this.queue.length !== 0) {
    item = this.queue.pop();

    request(
      {
        uri: item.url, method: 'GET'
      },
      function (error, response, body) {
        if (error || response.statusCode !== 200) 
          throw new Error('request(): ' + JSON.stringify(error));
        
        jsdom.env({
          html: body
          , scripts: ['http://code.jquery.com/jquery-1.7.1.min.js']
          , done: function (error, window) {
              if (error) throw new Error('jsdom.done(): ' + JSON.stringify(error));
              
              if (item.callback && typeof item.callback === 'function') {
                item.callback.apply(window);
              } else {
                item.defaultCallback.apply(window);
              }
            }
        });
      }
    );
  }
}

module.exports.Crawler = Crawler;