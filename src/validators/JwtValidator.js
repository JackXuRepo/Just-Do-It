const jwt = require('jsonwebtoken')
const config = require('../config/JwtConfig')

module.exports = {
    isAuthenicated (req, res, next){
        req.user = jwt.verify(req.body.token, config.authentication.jwtSecret)
        if (req.user != req.body.user) {
            req.user = null;
        }
        next();
    }
} 