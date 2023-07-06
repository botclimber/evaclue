const fs = require("fs")
const express = require("express")
const proxy = require("express-http-proxy")
const https = require("https")
const http = require("http")
const app = express()
const path = require("path")

/*const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/evaclue.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/evaclue.com/cert.pem'),
}*/

const NotificationsServer = `http://localhost:${process.env.not_PORT}`
const ReviewsServer = `http://localhost:${process.env.rev_PORT}`
const UsersServer = `http://localhost:${process.env.user_PORT}`

const port = process.env.PORT 

//app.use(express.static(__dirname + "/static"))

/*app.use("/not/*", (req, res) => {
  const url = req.baseUrl.replace("/not","")
  const fullUrl = `${NotficiationServer}${url}`
  
  console.log(fullUrl)

  return proxy(fullUrl) 
})*/

app.all("/notifications/v1/*", proxy(NotificationsServer, {
  proxyErrorHandler: function(err, res, next) {
    switch (err && err.code) {
      case 'ECONNRESET':    { return res.status(405).send('504 became 405'); }
      case 'ECONNREFUSED':  { return res.status(200).send('gotcher back'); }
      default:              { next(err); }
    }
  }
}))

app.all("/reviews/v1/*", proxy(ReviewsServer, {
  proxyErrorHandler: function(err, res, next) {
    switch (err && err.code) {
      case 'ECONNRESET':    { return res.status(405).send('504 became 405'); }
      case 'ECONNREFUSED':  { return res.status(200).send('gotcher back'); }
      default:              { next(err); }
    }
  }
}))

app.all("/user/*", proxy(UsersServer, {
  proxyErrorHandler: function(err, res, next) {
    switch (err && err.code) {
      case 'ECONNRESET':    { return res.status(405).send('504 became 405'); }
      case 'ECONNREFUSED':  { return res.status(200).send('gotcher back'); }
      default:              { next(err); }
    }
  }
}))


/**
 * serve main platform when trying to request root endpoint
 */
/*app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, "/static/index.html"))
})*/

app.get('/', function(req, res) {
  res.redirect("http://localhost:8080/")
})

// for PROD
/*https.createServer(options, app).listen(port, function(){
  console.log("Express server listening on port " + port);
});*/

// for DEV
http.createServer(app).listen(port, function(){
  console.log("Express server listening on port " + port);
});
