const jwt = require("jsonwebtoken")
const SECRET = "greedisgood"

const token = jwt.sign({id: 1, email: "dennisfsilva97@gmail.com", type: "superAdmin"}, SECRET)
const verToken = jwt.verify(token, SECRET)

console.log(token)
console.log(verToken)