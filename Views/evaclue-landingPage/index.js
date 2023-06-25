const express = require("express")
const proxy = require("express-http-proxy")
const app = express()
const path = require("path")

const NotificationServer = `http://localhost:${process.env.not_PORT}`

const port = process.env.PORT 

app.use(express.static(__dirname + "/static"))

/*app.use("/not/*", (req, res) => {
  const url = req.baseUrl.replace("/not","")
  const fullUrl = `${NotficiationServer}${url}`
  
  console.log(fullUrl)

  return proxy(fullUrl) 
})*/

app.post("/notification/v1/*", proxy(NotificationServer, {
  proxyErrorHandler: function(err, res, next) {
    switch (err && err.code) {
      case 'ECONNRESET':    { return res.status(405).send('504 became 405'); }
      case 'ECONNREFUSED':  { return res.status(200).send('gotcher back'); }
      default:              { next(err); }
    }
  }
}))

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, "/static/index.html"))
})

app.listen(port);
console.log('Server started at PORT:' + port);
console.log('Notification Server PATH:'+ NotificationServer);
