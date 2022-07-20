var express = require('express');
var router = express.Router();
var template = require('../lib/template');
var auth = require('../lib/auth');
var shortid = require('shortid');
var db = require('../lib/db');
var bcrypt = require('bcrypt');

module.exports = function (passport) {
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
            <p><input type="password" name="confirmPw" placeholder="confirmPassword"></p>
            <p><input type="text" name="nickname" placeholder="nickname"></p>
            <p><input type="submit" value="register"></p>
        </form>
        `, ''); 
        res.send(html);
    });

    router.post('/register', (req, res) => {
        var post = req.body;
        var email = post.email;
        var pw = post.pw;
        var confirmPw = post.confirmPw;
        var nickname = post.nickname;
        /* if (!email.value) {
            req.flash('error', 'Please enter your e-mail.');
        } else if (!pw.value) {
            req.flash('error', 'Please enter your password.');
        } else if (!confirmPw.value) {
            req.flash('error', 'Please enter the verification password.');
        } else if (!nickname.value) {
            req.flash('error', 'Please enter your nickname.');
         } else */ /* if (pw !== confirmPw) {
            req.flash('error', 'Password must same!');
        } else { */
        bcrypt.hash(pw, 10, (err, hash) => {
            if (err) {
                console.error('ERROR:' + err);
                throw err;
            } else {
                var user = {
                    id: shortid.generate(),
                    email: email,
                    password: hash,
                    nickname: nickname,
                };
                db.get('users').push(user).write();
                req.login(user, (err) => {
                    if (err) {
                        console.error('ERROR: ' + err);
                        throw err;
                    } else {
                        return res.redirect('/');
                    }
                });
            }
        });
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