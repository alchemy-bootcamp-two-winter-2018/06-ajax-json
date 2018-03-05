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
// It would lose the context for "this", and it is a method
Article.prototype.toHtml = function() {
  let template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);

  // COMMENT: What is going on in the line below? What do the question mark and colon represent? How have we seen this same logic represented previously?
  // Not sure? Check the docs!
  // This is referring to a ternary expression. It's kind of a shorthand "if" statement - the question mark says "evaluate the following - if this.publishedOn has a value, it is true and you should change the publishStatus to 'published " (this.daysAgo) days ago'; otherwise, it is false and the article is publishStatus (draft)
  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

// REVIEW: There are some other functions that also relate to all articles across the board, rather than just single instances. Object-oriented programming would call these "class-level" functions, that are relevant to the entire "class" of objects that are Articles.

// REVIEW: This function will take the rawData, how ever it is provided, and use it to instantiate all the articles. This code is moved from elsewhere, and encapsulated in a simply-named function for clarity.

// COMMENT: Where is this function called? What does 'rawData' represent now? How is this different from previous labs?
// This function is called in articleView.js as part of the articleView.fetchall method. The rawData represents the data from our "server" which represents data that is not hard-coded locally on our machines. This is different from data which is stored in a javascript file in previous labs (blogArticles.js)

Article.loadAll = articleData => {
  articleData.sort((a,b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)))

  const articles = [];
  articleData.forEach(articleObject => articles.push(new Article(articleObject)))
  return articles;
}
