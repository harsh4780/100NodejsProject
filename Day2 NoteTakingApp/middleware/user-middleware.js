const jwt = require("jsonwebtoken");

function isLoggedIn(req, res, next){
    if(req.cookies.token){
        jwt.verify(req.cookies.token, 'SHA256', (err, user)=>{
            if(err){
                res.redirect('/login');
            }
            else{
                req.user = user;
                next();
            }
        })
    }
    else{
        res.redirect('/login');
    }
}

module.exports = isLoggedIn;