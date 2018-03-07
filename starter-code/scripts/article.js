'use strict';

function Article (rawDataObj) {
  this.author = rawDataObj.author;
  this.authorUrl = rawDataObj.authorUrl;
  this.title = rawDataObj.title;
  this.category = rawDataObj.category;
  this.body = rawDataObj.body;
  this.publishedOn = rawDataObj.publishedOn;
}

// COMMENT: Why isn't this method written as an arrow function?
// Because it uses the 'this' keyword to refer to several different things. Arrow functions can only refer to one, specific 'this.'
Article.prototype.toHtml = function() {
  let template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);

  // COMMENT: What is going on in the line below? What do the question mark and colon represent? How have we seen this same logic represented previously?
  // This is a ternary operator. It's an if-then statement. Before the is the conditional. Between the ? and : is "do if true." After the : is "do if false."
  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

// REVIEW: There are some other functions that also relate to all articles across the board, rather than just single instances. Object-oriented programming would call these "class-level" functions, that are relevant to the entire "class" of objects that are Articles.

// REVIEW: This function will take the rawData, how ever it is provided, and use it to instantiate all the articles. This code is moved from elsewhere, and encapsulated in a simply-named function for clarity.

// COMMENT: Where is this function called? What does 'rawData' represent now? How is this different from previous labs?
// This function is called as part of the fetchALl method in articleView.js, which in turn is part of the initIndexPage method.
// rawData represents the data pulled from our "server," which is actually just the jackerIpsum.json file in our data folder.
Article.loadAll = articleData => {
  articleData.sort((a,b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)))

  const rawData = [];
  articleData.forEach(articleObject => rawData.push(new Article(articleObject)))
  return rawData;
}
