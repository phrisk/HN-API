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
 	var RE = new RegExp('x\?fnid\=[a-zA-Z0-9]+');	// regex for 'nextpage'

	// check if id is a valid page id
	if( validIDs.indexOf(req.params.id) !== -1)
		HNuri += req.params.id;

	// else, perform fnid regex and see if it passes
	else{
		
		var fnid = RE.exec(req.url);

		if ( fnid !== null )
			HNuri += 'x?' + fnid;
	}

	request({uri: HNuri}, 
		function(err, response, body){

			var self = this;
			self.items = new Array();

      // Error checking
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
          	self.items[i] = {
          		title: $(this).text(),
          		href: $(this).attr('href'),
          	};
          });

          // find each subtext and extract points, author, comments, date, id
          $('.subtext').each(function(i, item){

            // Check if the post is a normal (externally linking post)
            // otherwise, it's a yCombinator job advert or something
            if( $('span[id^=score]', this).length > 0 ){
            	self.items[i].points = $("span", this).text().split(' ')[0];
            	self.items[i].by = $('a[href*=user]', this).text();
            	self.items[i].comments = $('a[href*=item]', this).text().split(' ')[0];
            	self.items[i].date = $(this).text().split(' ')[4] + " " + $(this).text().split(' ')[5];
            	self.items[i].postid = $('a[href*=item]', this).attr('href').split('=')[1];

              // If the comment value = dissus, there are no comments
              if(self.items[i].comments == 'discuss')
              	self.items[i].comments = "0";
          }

      });

          // remove the last item from the list, it's irrelevant
          self.items.pop();

          //console.log(self.items);

          //We have all we came for, now let's build our views
          res.json(self.items);

      });
});
};