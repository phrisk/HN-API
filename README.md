# HackerNews API
An API for HackerNews written in node

## Usage

To run the application:

	$ node app.js
	Express server listening on port 3000

Navigating to 'localhost:3000/links' returns front page information as a JSON object:

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

Currently in early stages of development. I plan on expanding the API to return comments and so on.

## Tools 

 - [Nodejs](http://nodejs.org/)
 - [jQuery](http://jquery.com/)