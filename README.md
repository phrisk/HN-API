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

####Getting Links

* `localhost:3000/links` -- Front page links
* `localhost:3000/links/news2` -- Second page links
* `localhost:3000/links/newest` -- Most recent links
* `localhost:3000/links/ask` -- Ask links
* `localhost:3000/links/x?fnid=JwXpfFQtQt` -- Valid next page links

**Returns:**

* `items` -- Array containing each individual post's details:
  * `title` -- post title
  * `href` -- post link
  * `points` -- post points
  * `by` -- post author
  * `comments` -- number of comments
  * `date` -- how old the post is
  * `id` -- unique post id
* `nextID` -- fnid for next page of links

####Getting Comments

* `localhost:3000/post/4543202` -- Retrieve comments

**Returns:**

* `text` -- comment text
* `by` -- comment author
* `date` -- how old the comment is
* `indent` -- indentation level of comment
* `id` -- unique comment id

## Development

The application is built using Node. Data is scraped live from HN, parsed and returned as a JSON object:

## Tools 

 - [Nodejs](http://nodejs.org/)
 - [jQuery](http://jquery.com/)