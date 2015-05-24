/**
 * Module Dependencies
 */

var Superagent = require('superagent');

/**
 * Export the default `driver`
 */

module.exports = driver;

/**
 * Initialize the default
 * `driver` makes an GET
 * request using superagent
 *
 * @param {Object} opts
 * @return {Function} plugin
 */

function driver(opts) {
  var superagent = Superagent.agent(opts);

  return function plugin(xray) {

    xray.request = function request(cfg, fn) {
      var req = false;
            
      switch(cfg.method) {
        case 'get':
          req = superagent
          .get((typeof cfg == "string") ? cfg : cfg.url);
          break;
        
        case 'post':
          req = superagent
          .post((typeof cfg == "string") ? cfg : cfg.url)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send(cfg.data||{});
          break;
          
        case 'put':
          req = superagent
          .post((typeof cfg == "string") ? cfg : cfg.url)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send(cfg.data||{});
          break;
      }
      
      var ua = xray.ua();
      if (ua) {
        req.set('User-Agent', ua);
      }
      
      //req.set((typeof cfg == "object") ? cfg : {});
      
      req.end(function(err, res) {
        if (err) return fn(err);
        else return fn(null, res.text);
      });
    };

    return xray;
  }
}
