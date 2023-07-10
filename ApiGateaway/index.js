"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_http_proxy_1 = __importDefault(require("express-http-proxy"));
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
/*const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/evaclue.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/evaclue.com/cert.pem'),
}*/
// Services
const NotificationsServer = `${process.env.domain}:${process.env.not_PORT}`;
const ReviewsServer = `${process.env.domain}:${process.env.rev_PORT}`;
const UsersServer = `${process.env.domain}:${process.env.user_PORT}`;
// Views
const mainPlatform = `${process.env.domain}:${process.env.mainPage_PORT}`;
const loginPage = `${process.env.domain}:${process.env.loginPage_PORT}`;
const adminPage = `${process.env.domain}:${process.env.adminPage_PORT}`;
const port = process.env.PORT || 80 || 443;
app.use('/', express_1.default.static(path_1.default.join(__dirname, "../Views/evaclue-landingPage/static/")));
app.use('/home', express_1.default.static(path_1.default.join(__dirname, "../Views/MainPlatform/app/src/")));
app.all("/notifications/v1/*", (0, express_http_proxy_1.default)(NotificationsServer, {
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
}));
app.all("/reviews/v1/*", (0, express_http_proxy_1.default)(ReviewsServer, {
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
}));
app.all("/user/*", (0, express_http_proxy_1.default)(UsersServer, {
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
}));
// for PROD
/*https.createServer(options, app).listen(port, function(){
  console.log("Express server listening on port " + port);
});*/
// for DEV
http_1.default.createServer(app).listen(port, function () {
    console.log("Express server listening on port " + port);
});
