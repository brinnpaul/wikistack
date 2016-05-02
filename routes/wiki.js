var express = require('express');
var wikiRouter = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;


wikiRouter.get('/', function(req, res, next){
	res.redirect('/');
})

wikiRouter.post('/', function(req, res, next){

	var page = Page.build({
		title: req.body.title,
		content: req.body.content
	});

	page.save();
	// res.redirect('/');
	res.json({page_title: req.body.title, page_content: req.body.content}).send();

})

wikiRouter.get('/add', function(req, res, next){
	res.render('addpage', {title: "wikistack page"});
})


module.exports = wikiRouter;