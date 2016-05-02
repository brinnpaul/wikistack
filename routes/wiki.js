var express = require('express');
var wikiRouter = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

wikiRouter.get('/', function(req, res, next){
	Page.findAll()
	.then(function(foundPages) {
		res.render('index', {
			allPages: foundPages
		});
	}).catch(next);
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
		}
	})
	.then(function(foundPage) {
		res.render('wikipage', {
			pageTitle: foundPage.title,
			pageContent: foundPage.content
		});
		return foundPage;
	})
	.catch(next);

	// res.send('This is where we\'re going' +req.params.pageTitle);
});


module.exports = wikiRouter;
