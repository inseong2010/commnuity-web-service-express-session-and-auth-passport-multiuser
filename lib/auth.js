module.exports = {
    isOwner: function(req, res) {
        if (req.user) {
            return true;
        } else {
            return false;
        }
    },
    statusUI: function(req ,res) {
        var authStatusUI = '<a href="/auth/login">login</a> | <a href="/auth/register">Register</a>'
        if (this.isOwner(req, res)) {
            authStatusUI = `${req.user.nickname}님 | <a href="/auth/logout">logout</a>`
        }
        return authStatusUI;
    }
}