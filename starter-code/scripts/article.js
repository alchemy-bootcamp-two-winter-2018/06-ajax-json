'use strict';

function Article (rawDataObj) {
  this.author = rawDataObj.author;
  this.authorUrl = rawDataObj.authorUrl;
  this.title = rawDataObj.title;
  this.category = rawDataObj.category;
  this.body = rawDataObj.body;
  this.publishedOn = rawDataObj.publishedOn;
}

// COMMENTed: Why isn't this method written as an arrow function?
// We want the "this" referred to inside the method to point to the object the method is called on, not the global object (which is where it would point if we'd used an arrow function).
Article.prototype.toHtml = function() {
  let template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);

  // COMMENTed: What is going on in the line below? What do the question mark and colon represent? How have we seen this same logic represented previously?
  // Not sure? Check the docs!
  // This is an example of a ternary operator, which functions as an abbreviated way of writing an "if/else" statement. The question mark separates the condition from the first expression. The colon separates the first and second expressions. If the condition is truthy, the first expression is returned. If it is falsey, the second expression is returned.
  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

// REVIEW: There are some other functions that also relate to all articles across the board, rather than just single instances. Object-oriented programming would call these "class-level" functions, that are relevant to the entire "class" of objects that are Articles.

// REVIEW: This function will take the rawData, how ever it is provided, and use it to instantiate all the articles. This code is moved from elsewhere, and encapsulated in a simply-named function for clarity.

// COMMENTed: Where is this function called? What does 'rawData' represent now? How is this different from previous labs?
// Calling this function is one of our TODOs in the articleView file. We'll now pass in JSON text instead of a JavaScript array of objects.
Article.loadAll = articleData => {
  articleData.sort((a,b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)))

  const articles = [];
  articleData.forEach(articleObject => articles.push(new Article(articleObject)))
  return articles;
}
