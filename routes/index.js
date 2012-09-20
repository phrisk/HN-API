/**
 * Module dependencies.
 */

var request = require('request')
 , jsdom = require('jsdom');

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'HackerNews API' });
};

/*
 * GET news page.
 */

exports.getpage = function(req, res){

 	var HNuri = 'http://news.ycombinator.com/';		// default URL
 	var validIDs = [ 'newest', 'news2', 'ask' ];	// valie page ids
 	var RE = new RegExp('x\?fnid\=[a-zA-Z0-9]+');	// regex for 'nextpage' fnid

	// check if id is a valid page id
	if( validIDs.indexOf(req.params.id) !== -1)
		HNuri += req.params.id;

	// else, perform fnid regex and see if it passes
	else{

		var fnid = RE.exec(req.url);				// execute regex on url

		if ( fnid !== null )                // i.e if the regex found the fnid part
			HNuri += 'x?' + fnid;
    else
      console.log('Incorrect id - stop here')
      //HANDLE INCORRECT ID
    }

	// Begin request
	request({uri: HNuri}, 
		function(err, response, body){

			var self = this;
      self.json = new Object();
      self.json.items = new Array();

      // Error checking - BUG: this needs fixed, when no internet connention
      // this casues node to crash as response.statusCode is undefined
      if(err && response.statusCode !== 200){console.log('Request error.');}

      console.log('Page requested: ' + HNuri);

      // Open up page to parse, injecting jQuery
      jsdom.env({
      	html: body,
      	scripts: ['http://code.jquery.com/jquery-1.6.min.js']
      }, 
      function(err, window){

      	var $ = window.$;

          // find each post and extract the link and title
          $('.title a').each(function(i, item){
          	self.json.items[i] = {
          		title: $(this).text(),
          		href: $(this).attr('href')
          	};
          });

          // find each subtext and extract points, author, comments, date, id
          $('.subtext').each(function(i, item){

            // Check if the post is a normal (externally linking post)
            // otherwise, it's a yCombinator job advert or something
            if( $('span[id^=score]', this).length > 0 ){
            	self.json.items[i].points = $("span", this).text().split(' ')[0];
            	self.json.items[i].by = $('a[href*=user]', this).text();
            	self.json.items[i].comments = $('a[href*=item]', this).text().split(' ')[0];
            	self.json.items[i].date = $(this).text().split(' ')[4] + " " + $(this).text().split(' ')[5];
            	self.json.items[i].postid = $('a[href*=item]', this).attr('href').split('=')[1];

              // If the comment value = dissus, there are no comments
              if(self.json.items[i].comments == 'discuss')
              	self.json.items[i].comments = "0";
            }

          });

          // The last scraped result is always the link for the next page of
          // posts, basically here, we take the href for the next page 
          // (last element of items[]) and set it to nextID
          self.json.nextID = self.json.items[self.json.items.length-1].href;

          // remove the last element from items[]
          self.json.items.pop();

          //console.log(self.items);

          // Data scraped and processed, therefore render as JSON
          res.json(self.json);

      });
    });
};

/*
 * GET post page.
 */

 exports.getpost = function(req, res){

  var HNuri = 'http://news.ycombinator.com/item?id=';   // default URL
  var RE = new RegExp('[0-9]{7}'); // regex for 'nextpage' fnid

  var postid = RE.exec(req.params.id);  // execute regex on url

  // check if id is a valid post id
  if ( postid !== null )                // i.e if the regex found the fnid part
    HNuri += req.params.id;
  else
    console.log('Incorrect id - stop here');//HANDLE INCORRECT ID

  // Begin request
  request({uri: HNuri}, 
    function(err, response, body){

      var self = this;
      self.json = new Object();
      self.json.comments = new Array();

      // Error checking - BUG: this needs fixed, when no internet connention
      // this casues node to crash as response.statusCode is undefined
      if(err && response.statusCode !== 200){console.log('Request error.');}

      console.log('Page requested: ' + HNuri);

      // Open up page to parse, injecting jQuery
      jsdom.env({
        html: body,
        scripts: ['http://code.jquery.com/jquery-1.6.min.js']
      }, 
      function(err, window){

        var $ = window.$;

          self.json.post = {
            title: $('.title a').text(),
            href: $('.title a').attr('href'),
            domain: ( $('.title .comhead').text().length > 0 ? $('.title .comhead').text() : "(self post)" ), // i.e if there is a domain, use it, otherwise it is a self post
            points: $("span", ".subtext").text().split(' ')[0],
            by: $('a[href*=user]', ".subtext").text(),
            comments: ( $('a[href*=item]', ".subtext").text().split(' ')[0] == "discuss" ? "0" : $('a[href*=item]', ".subtext").text().split(' ')[0] ), // // If the comment value = dissus, there are no comments
            date: $(".subtext").text().split(' ')[4] + " " + $(".subtext").text().split(' ')[5],
            postid: $('a[href*=item]', ".subtext").attr('href').split('=')[1]
          };

          // find each subtext and extract points, author, comments, date, id
          $('td td table').each(function(i, item){

            self.json.comments[i] = {
              text: $('tr td:eq(2) span[class*=comment]', this).text(),
              by: $('tr td:eq(2) span[class*=comhead] a[href*=user]', this).text(),
              date: $('tr td:eq(2) span[class*=comhead]', this).text().split(' ')[1] + " " + $('tr td:eq(2) span[class*=comhead]', this).text().split(' ')[2],
              indent: $('tr td:eq(0) img', this).attr('width') / 40,
              id: $('tr td:eq(2) span[class*=comhead] a[href*=item]', this).attr('href').split('=')[1]
            };

          });

          // Data scraped and processed, therefore render as JSON
          res.json(self.json);

        });
    });
};