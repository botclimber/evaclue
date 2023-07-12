import proxy from "express-http-proxy";
import http from "http";
import express, { Express, NextFunction, Request, Response } from 'express';

const app: Express = express();

// Services
const NotificationsServer = `${process.env.domain}:${process.env.not_PORT}`;
const ReviewsServer = `${process.env.domain}:${process.env.rev_PORT}`;
const UsersServer = `${process.env.domain}:${process.env.user_PORT}`;

// Views
const mainPlatform = `${process.env.domain}:${process.env.mainPage_PORT}`
const authPlatform = `${process.env.domain}:${process.env.loginPage_PORT}`
const adminPlatform = `${process.env.domain}:${process.env.adminPage_PORT}`

// TODO: also join any params sent with the header url e.g. ?param1=test&param2=test2
app.get('/', function(req: Request, res: Response) {

  console.log("serving to main Platform")
  const url = req.url
  res.redirect(`${mainPlatform}${url}`)
})

app.get('/login*', function(req: Request, res: Response) {

  console.log("serving auth Platform")
  const url = req.url.substring(6)
  res.redirect(`${authPlatform}${url}`)
})

app.get('/Admin*', function(req: Request, res: Response) {

  console.log("serving admin page")
  const url = req.url.substring(6)
  res.redirect(`${adminPlatform}${url}`)
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

const port = process.env.PORT || 80;

http.createServer(app).listen(port, function () {
  console.log("Express server listening on port " + port);
});
