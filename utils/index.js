const jwt = require('jsonwebtoken')
const generateToken = (user) => jwt.sign({id:user.id},'loges',{expiresIn:'2m'})

module.exports =   generateToken;