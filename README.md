# HackerNews API
An unofficial API for [Y Combinator's HackerNews](http://news.ycombinator.com/) written in [Node](http://nodejs.org/).

## About

The API is currently in early stages, developed for [HN-App](https://github.com/sshannon/HN-App) - a mobile version of HackerNews.

Please note I am not affiliated with Y Combinator in any way.

## Usage

###Running the application

	$ node app.js
	Express server listening on port 3000

Then navigate to `localhost:3000` 

###Accepted Commands

* `localhost:3000/links` -- Front page links
* `localhost:3000/links/news2` -- Second page links
* `localhost:3000/links/newest` -- Most recent links
* `localhost:3000/links/ask` -- Ask links
* `localhost:3000/links/x?fnid=JwXpfFQtQt` -- Valid next page links

## Development

The application is built using Node. Data is scraped live from HN, parsed and returned as a JSON object:

	[
	  {
	    "title": "Amit’s Thoughts on Grids",
	    "href": "http://www-cs-students.stanford.edu/~amitp/game-programming/grids/",
	    "points": "67",
	    "by": "kayral",
	    "comments": "3",
	    "date": "1 hour",
	    "id": "4454637"
	  },
	  ...
	]

## Tools 

 - [Nodejs](http://nodejs.org/)
 - [jQuery](http://jquery.com/)