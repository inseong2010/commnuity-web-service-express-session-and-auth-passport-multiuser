module.exports = function (passport) {
    var express = require('express');
    var router = express.Router();
    var template = require('../lib/template');
    var auth = require('../lib/auth');

    router.get('/login', (req, res) => {
        var fmsg = req.flash();
        var feedback = '';
        if (fmsg.error) {
            feedback = fmsg.error[0];
        }
        var title = 'WEB - login';
        var list = template.LIST(req.list);
        var html = template.HTML(title, list, `
        <h2 style="color:red;">${feedback}</h2>
        <form action="/auth/login" method="post">
            <p><input type="text" name="email" placeholder="email"class="email"></p>
            <p><input type="password" name="pw" placeholder="password"class="pw"></p>
            <p>
                <input type="submit" value="login">
            </p>
        </form>
        `, ''); 
        res.send(html);
    });

    router.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true
    }));

    router.get('/register', (req, res) => {
        var fmsg = req.flash();
        var feedback = '';
        if (fmsg.error) {
            feedback = fmsg.error[0];
        }
        var title = 'WEB - register';
        var list = template.LIST(req.list);
        var html = template.HTML(title, list, `
        <h2 style="color:red;">${feedback}</h2>
        <form action="/auth/register" method="post">
            <p><input type="text" name="email" placeholder="email"class="email"></p>
            <p><input type="password" name="pw" placeholder="password"class="pw"></p>
            <p><input type="password" name="confirm-pw" placeholder="confirmPassword"></p>
            <p><input type="text" name="nickname" placeholder="nickname"></p>
            <p><input type="submit" value="register"></p>
        </form>
        `, ''); 
        res.send(html);
    });

    router.get('/logout', (req, res) => {
        if (!auth.isOwner(req, res)) {
            res.redirect(`/auth/login`);
            return false;
        }
        req.logout((err) => {
            if (err) { return next(err); }
            res.redirect('/');
        });
    });
    return router;
}