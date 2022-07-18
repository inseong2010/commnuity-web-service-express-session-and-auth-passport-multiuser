var express = require("express");
var router = express.Router();
var path = require('path');
const fs = require("fs");
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template');
var auth = require('../lib/auth');

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
    var description = post.description
    /* if (!title.value) {
        return alert("제목 또는 내용을 작성하세요");
    } else  {*/
        fs.writeFile(`data/${title}`, description, (err) => {
            if (err) throw err;
            else {
                res.redirect(`/page/${title}`);
            };
        });
    // };
});

router.get('/update/:pageId', (req, res) => {
    if (!auth.isOwner(req, res)) {
        res.redirect(`/auth/login`);
        return false;
    }
    var filteredhack = path.parse(req.params.pageId).base;
    fs.readFile(`data/${filteredhack}`, 'utf8', function(err, description) {
    var list = template.LIST(req.list);
    var title = req.params.pageId;
    var html = template.HTML(title, list, 
    `
    <form action="/page/update" method="post">
        <input type="hidden" name="id" value="${title}">
        <p><input type="text" name="title" placeholder="title"class="title" value="${title}"></p>
        <p>
            <textarea name="description" placeholder="description" class="desc">${description}</textarea>
        </p>
        <p>
            <input type="submit">
        </p>
    </form>
    `, `<a href="/page/new">New Page!!</a> <a href="/page/update/${title}">update</a>`, auth.statusUI(req, res));
        res.send(html);
    });
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
    fs.rename(`data/${id}`, `data/${title}`, function(err) {
        if (err) {
            console.log('ERROR:' + err);
            throw err;
        }
        fs.writeFile(`data/${title}`, description, (err) => {
            if (err) throw err;
            else {
                res.redirect(`/page/${title}`);
            };
        });
    });
});

router.post('/delete', (req, res) => {
    if (!auth.isOwner(req, res)) {
        res.redirect(`/auth/login`);
        return false;
    }
    var post = req.body;
    var id = post.id;
    var filteredhack = path.parse(id).base;
    fs.unlink(`data/${filteredhack}`, function(err){
        res.redirect('/');
    });
});

router.get('/:pageId', (req, res, next) => {
    var filteredhack = path.parse(req.params.pageId).base;
    fs.readFile(`data/${filteredhack}`, 'utf8', function(err, description) {
        if (err) {
            next(err);
        } else {
        var title = req.params.pageId;
        var sanitizedTitle = sanitizeHtml(title);
        var sanitizedDescription = sanitizeHtml(description);
        var list = template.LIST(req.list);
        var html = template.HTML(sanitizedTitle, list, `<h2>${sanitizedTitle}</h2><p>${sanitizedDescription}</p>`, 
        `<a href="/page/new">New Page!!</a>
            <a href="/page/update/${sanitizedTitle}">update</a> 
            <form action="/page/delete" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input type="submit" value="delete">
            </form>
            `, auth.statusUI(req, res));
        res.send(html);
        };
    });
});

module.exports = router;