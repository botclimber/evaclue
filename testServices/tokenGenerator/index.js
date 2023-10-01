const jwt = require("jsonwebtoken")
const SECRET = "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4OTE5Njk5MywiaWF0IjoxNjg5MTk2OTkzfQ.NamGkAvyYvvfFHTG-PGvKFZtJFnR5lTWXmYcV_1covo"

const token = jwt.sign({userId: 1, userEmail: "superAdmin@evaclue.pt", userType: "superAdmin"}, SECRET)
const verToken = jwt.verify(token, SECRET)

console.log(token)
console.log(verToken)