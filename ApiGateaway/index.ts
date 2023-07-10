import proxy from "express-http-proxy";
import http from "http";
import https from "https";
import express, { Express, NextFunction, Request, Response } from 'express';
import fs from "fs";
import path from "path";

const app: Express = express();

/*const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/evaclue.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/evaclue.com/cert.pem'),
}*/

// Services
const NotificationsServer = `${process.env.domain}:${process.env.not_PORT}`;
const ReviewsServer = `${process.env.domain}:${process.env.rev_PORT}`;
const UsersServer = `${process.env.domain}:${process.env.user_PORT}`;

// Views
const mainPlatform = `${process.env.domain}:${process.env.mainPage_PORT}`

//app.use('/landPage', express.static(path.join(__dirname, "../Views/evaclue-landingPage/static/")));

/**
 * MainPlatform at the moment is not possible to run without running on a server, so we need to redirect
 * and as a downside the PORT is being shown, however this dont leed directly to any security breach.
 */
app.get('/', function(req, res) {

  console.log(mainPlatform)
  res.redirect(mainPlatform)
})

app.all(
  "/notifications/v1/*",
  proxy(NotificationsServer, {
    proxyErrorHandler: function (err, res, next) {
      switch (err && err.code) {
        case "ECONNRESET": {
          return res.status(405).send("504 became 405");
        }
        case "ECONNREFUSED": {
          return res.status(200).send("gotcher back");
        }
        default: {
          next(err);
        }
      }
    },
  })
);

app.all(
  "/reviews/v1/*",
  proxy(ReviewsServer, {
    proxyErrorHandler: function (err, res, next) {
      switch (err && err.code) {
        case "ECONNRESET": {
          return res.status(405).send("504 became 405");
        }
        case "ECONNREFUSED": {
          return res.status(200).send("gotcher back");
        }
        default: {
          next(err);
        }
      }
    },
  })
);

app.all(
  "/user/*",
  proxy(UsersServer, {
    proxyErrorHandler: function (err, res, next) {
      switch (err && err.code) {
        case "ECONNRESET": {
          return res.status(405).send("504 became 405");
        }
        case "ECONNREFUSED": {
          return res.status(200).send("gotcher back");
        }
        default: {
          next(err);
        }
      }
    },
  })
);

const port = process.env.PORT || 80 || 443;

// for PROD
/*https.createServer(options, app).listen(port, function(){
  console.log("Express server listening on port " + port);
});*/

// for DEV
http.createServer(app).listen(port, function () {
  console.log("Express server listening on port " + port);
});
