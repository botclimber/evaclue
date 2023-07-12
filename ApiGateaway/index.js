"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_http_proxy_1 = __importDefault(require("express-http-proxy"));
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
// Services
const NotificationsServer = `${process.env.domain}:${process.env.not_PORT}`;
const ReviewsServer = `${process.env.domain}:${process.env.rev_PORT}`;
const UsersServer = `${process.env.domain}:${process.env.user_PORT}`;
// Views
const mainPlatform = `${process.env.domain}:${process.env.mainPage_PORT}`;
const authPlatform = `${process.env.domain}:${process.env.loginPage_PORT}`;
const adminPlatform = `${process.env.domain}:${process.env.adminPage_PORT}`;
// TODO: also join any params sent with the header url e.g. ?param1=test&param2=test2
app.get('/', function (req, res) {
    console.log("serving to main Platform");
    const url = req.url;
    res.redirect(`${mainPlatform}${url}`);
});
app.get('/login*', function (req, res) {
    console.log("serving auth Platform");
    const url = req.url.substring(6);
    res.redirect(`${authPlatform}${url}`);
});
app.get('/Admin*', function (req, res) {
    console.log("serving admin page");
    const url = req.url.substring(6);
    res.redirect(`${adminPlatform}${url}`);
});
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
const port = process.env.PORT || 80;
http_1.default.createServer(app).listen(port, function () {
    console.log("Express server listening on port " + port);
});
