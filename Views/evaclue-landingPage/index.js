const express = require("express")
const app = express()
const path = require("path")

const port = process.env.PORT | 80

app.use(express.static(__dirname + "/static"))

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, "/static/index.html"))
})

app.listen(port);
console.log('Server started at http://localhost:' + port);
