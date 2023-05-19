const jwt = require('jsonwebtoken')
const secret = process.env.SECRET

const token = jwt.sign({userEmail: 'cat@cat.pt',userId: 2, userType: 'admin'}, secret, {expiresIn: '2h'})
const verToken = jwt.verify(token, secret)

console.log(token)
console.log(verToken)

