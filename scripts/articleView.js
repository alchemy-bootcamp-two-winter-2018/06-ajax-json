'use strict';

const articleView = {};

articleView.populateFilters = () => {
    $('article').each(function() {
        if (!$(this).hasClass('template')) {
            let val = $(this).find('address a').text();
            let optionTag = `<option value="${val}">${val}</option>`;

            if ($(`#author-filter option[value="${val}"]`).length === 0) {
                $('#author-filter').append(optionTag);
            }

            val = $(this).attr('data-category');
            optionTag = `<option value="${val}">${val}</option>`;
            if ($(`#category-filter option[value="${val}"]`).length === 0) {
                $('#category-filter').append(optionTag);
            }
        }
    });
};

articleView.handleAuthorFilter = () => {
    $('#author-filter').on('change', function() {
        if ($(this).val()) {
            $('article').hide();
            $(`article[data-author="${$(this).val()}"]`).fadeIn();
        } else {
            $('article').fadeIn();
            $('article.template').hide();
        }
        $('#category-filter').val('');
    });
};

articleView.handleCategoryFilter = () => {
    $('#category-filter').on('change', function() {
        if ($(this).val()) {
            $('article').hide();
            $(`article[data-category="${$(this).val()}"]`).fadeIn();
        } else {
            $('article').fadeIn();
            $('article.template').hide();
        }
        $('#author-filter').val('');
    });
};

articleView.handleMainNav = () => {
    $('.main-nav').on('click', '.tab', function() {
        $('.tab-content').hide();
        $(`#${$(this).data('content')}`).fadeIn();
    });

    $('.main-nav .tab:first').click();
};

articleView.setTeasers = () => {
    $('.article-body *:nth-of-type(n+2)').hide();
    $('article').on('click', 'a.read-on', function(e) {
        e.preventDefault();
        if ($(this).text() === 'Read on →') {
            $(this).parent().find('*').fadeIn();
            $(this).html('Show Less &larr;');
        } else {
            $('body').animate({
                scrollTop: ($(this).parent().offset().top)
            },200);
            $(this).html('Read on &rarr;');
            $(this).parent().find('.article-body *:nth-of-type(n+2)').hide();
        }
    });
};

articleView.initNewArticlePage = () => {
    $('.tab-content').show();
    $('#export-field').hide();
    $('#article-json').on('focus', function(){
        this.select();
    });

    $('#new-form').on('change', 'input, textarea', articleView.create);
};

articleView.create = () => {
    let article;
    $('#articles').empty();

    // eslint-disable-next-line
    article = new Article({
        title: $('#article-title').val(),
        author: $('#article-author').val(),
        authorUrl: $('#article-author-url').val(),
        category: $('#article-category').val(),
        body: $('#article-body').val(),
        publishedOn: $('#article-published:checked').length ? new Date() : null
    });

    $('#articles').append(article.toHtml());
    $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
    });

    $('#export-field').show();
    $('#article-json').val(`${JSON.stringify(article)},`);
};

articleView.renderArticles = function(articles) {
    articles.forEach(article => {
        $('#articles').append(article.toHtml());
    });
};


// REVIEW: This function will retrieve the data from either a local or remote source
articleView.fetchAll = function() {
    // TODOne:
    // 1) make an AJAX call to the server for the raw data
    $.getJSON('data/hackerIpsum.json')
    // 2) ASYNCHRONOUSLY (use .then)
        .done(articleData => {
        // A) call Article.loadAll with the data you got from the server and get array of Article objects
            //eslint-disable-next-line
            const articles = Article.loadAll(articleData);
            // B) call renderArticles to put the article object into the DOM
            this.renderArticles(articles);
            // C) call setupView method to finish wiring up the UI for things that need the data to be loaded
            this.setupView();
        })
        .fail(response => {
            console.log('ERROR', response);
        });
};

articleView.setupView = () => {
    articleView.populateFilters();
    articleView.handleCategoryFilter();
    articleView.handleAuthorFilter();
    articleView.setTeasers();
};

articleView.initIndexPage = function() {
    // TODOne: call the fetchAll method to initiate and complete loading of articles
    this.fetchAll();
    // (follow-on activities happen from the async handle in THAT method)

    // wire up in setup that doesn't need the data loaded
    articleView.handleMainNav();
};
