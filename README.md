# HackerNews API
An unofficial API for [Y Combinator's HackerNews](http://news.ycombinator.com/) written in [Node](http://nodejs.org/).

## About

The API is currently in early stages, developed for [HNApp](https://github.com/sshannon/HNApp) - a mobile version of HackerNews.

Currently the API will only return the front page links as a JSON object, but may be extended to allow full interaction and data retrieval. 

Please note I am not affiliated with Y Combinator in any way.

## Usage

To run the application:

	$ node app.js
	Express server listening on port 3000

Navigating to `localhost:3000/links` returns front page information as a JSON object:

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

## Development

The application is built using Node. Data is loaded and scraped live from HN, parsed and returned as a JSON object.

## Tools 

 - [Nodejs](http://nodejs.org/)
 - [jQuery](http://jquery.com/)