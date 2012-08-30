
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , jsdom = require('jsdom')
  , request = require('request')
  , url = require('url');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

// MY APPLICATION

app.get('/links', function(req, res){
  request({uri: 'http://news.ycombinator.com/'}, 
    function(err, response, body){
      
      var self = this;
      self.items = new Array();
  
      // Error checkingh
      if(err && response.statusCode !== 200){console.log('Request error.');}

      // Open up page to parse
      jsdom.env({
        html: body,
        scripts: ['http://code.jquery.com/jquery-1.6.min.js']
        }, 
        function(err, window){

          var $ = window.$;

          $('.title a').each(function(i, item){
            self.items[i] = {
              title: $(this).text(),
              href: $(this).attr('href'),
            };
          });

          $('.subtext').each(function(i, item){
            self.items[i].points = $("span", this).text().split(' ')[0];
            self.items[i].by = $('a[href*=user]', this).text();
            self.items[i].comments = $('a[href*=item]', this).text().split(' ')[0];
            self.items[i].date = $(this).text().split(' ')[4] + " " + $(this).text().split(' ')[5];
            self.items[i].id = $('a[href*=item]', this).attr('href').split('=')[1];

            // If the comment value = dissus, there are no comments
            if(self.items[i].comments == 'discuss')
                self.items[i].comments = "0";
          });

          // remove the last item from the list, it's irrelevant
          self.items.pop();

          //console.log(self.items);

          //We have all we came for, now let's build our views
          res.json(self.items);

        });
    });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
