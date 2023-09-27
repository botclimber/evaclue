import proxy from "express-http-proxy";
import http from "http";
import express, { Express, NextFunction, Request, Response } from 'express';
import * as services from "./src/availableServices";
import path from "path";

const app: Express = express();
const FILE_LIMIT_SIZE = "5mb"

// Views // only for dev purposes
const mainPlatform = "../../../evaclueFrontEnd/"
const authPlatform = `${process.env.HOST}:${process.env.loginPage_PORT}`
const adminPlatform = `${process.env.HOST}:${process.env.adminPage_PORT}`

/**
 * Reverse proxying to serve views
 * 
 */
app.get('/', function(req: Request, res: Response) {

  app.use(express.static(path.join(__dirname, mainPlatform)));

  res.sendFile(path.join(__dirname, `${mainPlatform}`))
})

app.get('/login*', function(req: Request, res: Response) {

  console.log("serving auth Platform")
  const url = req.url.substring(6)
  console.log(authPlatform+url)
  res.redirect(`${authPlatform}${url}`)
})

app.get('/admin*', function(req: Request, res: Response) {

  console.log("serving admin page")
  const url = req.url.substring(6)
  res.redirect(`${adminPlatform}${url}`)
})

/**
 * Reverse proxying to services
 * 
 */
console.log(services.NotificationsService)
app.all(
  `/${services.NotificationsService.name}/${services.NotificationsService.version}/*`,
  proxy(services.NotificationsService.fullPath, {
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

console.log(services.ReviewsService)
app.all(
  `/${services.ReviewsService.name}/${services.ReviewsService.version}/*`,
  proxy(services.ReviewsService.fullPath, {
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

console.log(services.UsersService)
app.all(
  `/${services.UsersService.name}/${services.UsersService.version}/*`,
  proxy(services.UsersService.fullPath, {
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

console.log(services.GeoLocationService)
app.all(
  `/${services.GeoLocationService.name}/${services.GeoLocationService.version}/*`,
  proxy(services.GeoLocationService.fullPath, {
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

console.log(services.ResidenceOwnerService)
app.all(
  `/${services.ResidenceOwnerService.name}/${services.ResidenceOwnerService.version}/*`,
  proxy(services.ResidenceOwnerService.fullPath, {
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

console.log(services.fileHandlerService)
app.all(
  `/${services.fileHandlerService.name}/${services.fileHandlerService.version}/*`,
  proxy(services.fileHandlerService.fullPath, {
    limit: FILE_LIMIT_SIZE,
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

// at the moment not implemented
console.log(services.SupportService)
app.all(
  `/${services.SupportService.name}/${services.SupportService.version}/*`,
  proxy(services.SupportService.fullPath, {
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

app.use(express.json({ limit: FILE_LIMIT_SIZE }));
app.use(express.urlencoded({ limit: FILE_LIMIT_SIZE, extended: true })); 

http.createServer(app).listen(port, function () {
  console.log("Express server listening on port " + port);
});
