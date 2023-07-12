"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_http_proxy_1 = __importDefault(require("express-http-proxy"));
const https_1 = __importDefault(require("https"));
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const options = {
    key: fs_1.default.readFileSync('/etc/letsencrypt/live/evaclue.com/privkey.pem'),
    cert: fs_1.default.readFileSync('/etc/letsencrypt/live/evaclue.com/cert.pem'),
};
// Services
const NotificationsServer = `${process.env.domain}:${process.env.not_PORT}`;
const ReviewsServer = `${process.env.domain}:${process.env.rev_PORT}`;
const UsersServer = `${process.env.domain}:${process.env.user_PORT}`;
// TODO: also join any params sent with the header url e.g. ?param1=test&param2=test2
app.use('/', express_1.default.static(path_1.default.join(__dirname, "../Views/MainPlatform/app/dist/")));
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
const port = process.env.PORT || 443;
https_1.default.createServer(options, app).listen(port, function () {
    console.log("Express server listening on port " + port);
});
