const jwt = require("jsonwebtoken")
const SECRET = "greedisgood"

const token = jwt.sign({userId: 1, userEmail: "superAdmin@evaclue.pt", userType: "superAdmin"}, SECRET)
const verToken = jwt.verify(token, SECRET)

console.log(token)
console.log(verToken)