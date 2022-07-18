var express = require("express");
var router = express.Router();
var template = require('../lib/template');
var auth = require('../lib/auth');


router.get('/', (req, res) => {
    var title = 'welcome';
    var description = 'hello';
    var list = template.LIST(req.list);
    var html = template.HTML(title, list, `<h2>${title}</h2><p>${description}</p>`, `<a href="/page/new">New Page!!</a>`, auth.statusUI(req, res));
    res.send(html);
});

module.exports = router;