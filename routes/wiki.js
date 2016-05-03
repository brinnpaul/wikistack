var express = require('express');
var wikiRouter = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;
var Promise = require('bluebird');

wikiRouter.get('/', function(req, res, next){
	Page.findAll()
	.then(function(foundPages) {
		res.render('index', {
			allPages: foundPages
		});
	}).catch(next);
});

wikiRouter.get('/users', function(req, res, next) {
	User.findAll()
	.then(function(foundUsers) {
		res.render('users', {
			allUsers: foundUsers
		});
	}).catch(next);
});

wikiRouter.get('/users/:userId', function(req, res, next) {

	var userPromise = User.findById(req.params.userId);
	var pagesPromise = Page.findAll({
		where: {
			authorId: req.params.userId
		}
	});

	Promise.all([
		userPromise,
		pagesPromise
	])
	.spread(function(user, pages) {
		console.log('HELLO', user, pages);
		// var user = values[0];
		// var pages = values[1];
		res.render('userID', {user: user, pages: pages});
	})
	.catch(next);

});


wikiRouter.post('/', function(req, res, next){
// ---- updates DB -----
	// var page = Page.build({
	// 	title: req.body.title,
	// 	content: req.body.content
	// });
	// page.save()
	// .then(function(newPage) {
	// 	res.redirect(newPage.route);
	// }).catch(next);

	User.findOrCreate({
	  where: {
	    name: req.body.author,
	    email: req.body.email
	  }
	})
	.then(function (values) {

	  var user = values[0];

	  var page = Page.build({
	    title: req.body.title,
	    content: req.body.content
	  });

	  return page.save().then(function (page) {
	    return page.setAuthor(user);
	  });

	})
	.then(function (page) {
	  res.redirect(page.route);
	})
	.catch(next);

});

wikiRouter.get('/add', function(req, res, next){
	res.render('addpage', {title: "wikistack page"});
});

wikiRouter.get('/:pageTitle', function(req, res, next) {
	Page.findOne({
		// attributes: [title, urlTitle, content],
		// findAll fails for some unknown reason
		where : {
			urlTitle: req.params.pageTitle
		},
		include: [
			{model: User, as: 'author'}
		]
	})
	.then(function(foundPage) {
		// res.json(foundPage).send();
		res.render('wikipage', {
			pageAuthID: foundPage.author.id,
			pageAuthor: foundPage.author.name,
			pageTitle: foundPage.title,
			pageContent: foundPage.content
		});
		return foundPage;
	})
	.catch(next);

	// res.send('This is where we\'re going' +req.params.pageTitle);
});


module.exports = wikiRouter;
