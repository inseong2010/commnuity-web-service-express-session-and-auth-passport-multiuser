var db  = require('../lib/db');

module.exports = function (app) {
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        var user = db.get('users').find({id: id}).value();
        done(null, user);
    });

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'pw'
    },
    (email, password, done) => {
        var user = db.get('users').find({ email: email, password: password}).value();
        console.log(user);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false, {
                message: 'Incorrect user infomation'
            });
        }
    }));
    return passport;
}

