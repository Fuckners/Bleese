function adminAuth(req, res, next) {
    if (req.session.user) {
        if (req.session.user.level) {
            next(); // serve para dar continuidade na requisição
        } else {
            res.redirect('/login')
        }
    } else {
        res.redirect('/login')
    }
}

module.exports = adminAuth