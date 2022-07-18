module.exports = function (app) {
    var authData = {
        email: 'admin',
        pw: 'admin',
        nickname: '관리자',
    }

    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
        done(null, user.email);
    });

    passport.deserializeUser((id, done) => {
        done(null, authData);
    });

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'pw'
    },
    (username, password, done) => {
        if (username === authData.email) {
            if (password === authData.pw) {
                return done(null, authData);
            } else {
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }
        } else {
            return done(null, false, {
                message: 'Incorrect username.'
            });
        }
    }));
    return passport;
}

