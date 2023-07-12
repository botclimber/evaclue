import proxy from "express-http-proxy";
import https from "https";
import express, { Express, NextFunction, Request, Response } from 'express';
import fs from "fs";
import path from "path";

const app: Express = express();

const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/evaclue.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/evaclue.com/cert.pem'),
}

// Services
const NotificationsServer = `${process.env.domain}:${process.env.not_PORT}`;
const ReviewsServer = `${process.env.domain}:${process.env.rev_PORT}`;
const UsersServer = `${process.env.domain}:${process.env.user_PORT}`;

// Views
const mainPage: string = "../Views/MainPlatform/app/dist/"
const adminPage: string = "../Views/Admin/dist/"
//const authPage: string = "../Views/userclient/dist/"

app.get('/', function(req: Request, res: Response) {

  app.use(express.static(path.join(__dirname, mainPage)));

  res.sendFile(path.join(__dirname, `${mainPage}`))
})

app.get('/admin', function(req: Request, res: Response) {

  app.use(express.static(path.join(__dirname, adminPage)));

  console.log(req.url)
  res.sendFile(path.join(__dirname, `${adminPage}`))
})

/*app.get('/login', function(req: Request, res: Response) {

  app.use(express.static(path.join(__dirname, authPage)));

  console.log(req.url)
  res.sendFile(path.join(__dirname, `${authPage}`))
})*/

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

const port = process.env.PORT || 443;

https.createServer(options, app).listen(port, function(){
  console.log("Express server listening on port " + port);
});
