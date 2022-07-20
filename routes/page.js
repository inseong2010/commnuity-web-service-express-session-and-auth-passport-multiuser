var express = require("express");
var router = express.Router();
var path = require('path');
const fs = require("fs");
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template');
var auth = require('../lib/auth');
var db = require('../lib/db');
var shortId = require('shortid');

router.get('/new', (req, res) => {
    if (!auth.isOwner(req, res)) {
        res.redirect(`/auth/login`);
        return false;
    }
    var title = 'create new page';
    var list = template.LIST(req.list);
    var html = template.HTML(title, list, `
    <form action="/page/new" method="post">
    <p><input type="text" name="title" placeholder="title"class="title"></p>
    <p>
        <textarea name="description" placeholder="description" class="desc"></textarea>
    </p>
    <p>
        <input type="submit">
    </p>
    </form>
    `, '', auth.statusUI(req, res)); 
    res.send(html);
});

router.post('/new', (req, res) => {
    if (!auth.isOwner(req, res)) {
        res.redirect(`/auth/login`);
        return false;
    }
    var post = req.body;
    var title = post.title;
    var description = post.description;
    var id = shortId.generate()
    db.get('pages').push({
        id: id,
        title: title,
        description: description,
        user_Id: req.user.id
    }).write();
    res.redirect(`/page/${id}`);
});

router.get('/update/:pageId', (req, res) => {
    if (!auth.isOwner(req, res)) {
        res.redirect(`/auth/login`);
        return false;
    }
    var page = db.get('pages').find({id: req.params.pageId}).value();
    if (page.user_Id !== req.user.id) {
        return res.redirect('/');
    }
    var list = template.LIST(req.list);
    var title = page.title;
    var description = page.description;
    var html = template.HTML(title, list, 
    `
    <form action="/page/update" method="post">
        <input type="hidden" name="id" value="${page.id}">
        <p><input type="text" name="title" placeholder="title"class="title" value="${title}"></p>
        <p>
            <textarea name="description" placeholder="description" class="desc">${description}</textarea>
        </p>
        <p>
            <input type="submit">
        </p>
    </form>
    `, `<a href="/page/new">New Page!!</a> <a href="/page/update/${page.id}">update</a>`, auth.statusUI(req, res));
    res.send(html);
});

router.post('/update', (req, res) => {
    if (!auth.isOwner(req, res)) {
        res.redirect(`/auth/login`);
        return false;
    }
    var post = req.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    var page = db.get('pages').find({id: id}).value();
    if (page.user_Id !== req.user.id) {
        return res.redirect('/');
    }
    db.get('pages').find({id: id}).assign({title: title, description: description}).write();
    res.redirect(`/page/${page.id}`);
});

router.post('/delete', (req, res) => {
    if (!auth.isOwner(req, res)) {
        res.redirect(`/auth/login`);
        return false;
    }
    var post = req.body;
    var id = post.id;
    var page = db.get('pages').find({id:id}).value();
    if (page.user_Id !== req.user.id) {
        return res.redirect('/');
    }
    db.get('pages').remove({id: id}).write();
    res.redirect('/');
});

router.get('/:pageId', (req, res, next) => {
    var page = db.get('pages').find({id: req.params.pageId}).value();
    var user = db.get('users').find({id:page.user_Id}).value();
    var sanitizedTitle = sanitizeHtml(page.title);
    var sanitizedDescription = sanitizeHtml(page.description);
    var list = template.LIST(req.list);
    var html = template.HTML(sanitizedTitle, list, `<h2>${sanitizedTitle}</h2><p>${sanitizedDescription}</p> <p>by ${user.nickname}</p>`, 
    `<a href="/page/new">New Page!!</a>
        <a href="/page/update/${page.id}">update</a> 
        <form action="/page/delete" method="post">
        <input type="hidden" name="id" value="${page.id}">
        <input type="submit" value="delete">
        </form>
        `, auth.statusUI(req, res));
    res.send(html);
});

module.exports = router;