"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_http_proxy_1 = __importDefault(require("express-http-proxy"));
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const services = __importStar(require("./src/availableServices"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const FILE_LIMIT_SIZE = "5mb";
// Views // only for dev purposes
const mainPlatform = "../../../evaclueFrontEnd/";
const authPlatform = `${process.env.HOST}:${process.env.loginPage_PORT}`;
const adminPlatform = `${process.env.HOST}:${process.env.adminPage_PORT}`;
/**
 * Reverse proxying to serve views
 *
 */
app.get('/', function (req, res) {
    app.use(express_1.default.static(path_1.default.join(__dirname, mainPlatform)));
    res.sendFile(path_1.default.join(__dirname, `${mainPlatform}`));
});
app.get('/login*', function (req, res) {
    console.log("serving auth Platform");
    const url = req.url.substring(6);
    console.log(authPlatform + url);
    res.redirect(`${authPlatform}${url}`);
});
app.get('/admin*', function (req, res) {
    console.log("serving admin page");
    const url = req.url.substring(6);
    res.redirect(`${adminPlatform}${url}`);
});
/**
 * Reverse proxying to services
 *
 */
console.log(services.NotificationsService);
app.all(`/${services.NotificationsService.name}/${services.NotificationsService.version}/*`, (0, express_http_proxy_1.default)(services.NotificationsService.fullPath, {
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
console.log(services.ReviewsService);
app.all(`/${services.ReviewsService.name}/${services.ReviewsService.version}/*`, (0, express_http_proxy_1.default)(services.ReviewsService.fullPath, {
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
console.log(services.UsersService);
app.all(`/${services.UsersService.name}/${services.UsersService.version}/*`, (0, express_http_proxy_1.default)(services.UsersService.fullPath, {
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
console.log(services.GeoLocationService);
app.all(`/${services.GeoLocationService.name}/${services.GeoLocationService.version}/*`, (0, express_http_proxy_1.default)(services.GeoLocationService.fullPath, {
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
console.log(services.ResidenceOwnerService);
app.all(`/${services.ResidenceOwnerService.name}/${services.ResidenceOwnerService.version}/*`, (0, express_http_proxy_1.default)(services.ResidenceOwnerService.fullPath, {
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
console.log(services.fileHandlerService);
app.all(`/${services.fileHandlerService.name}/${services.fileHandlerService.version}/*`, (0, express_http_proxy_1.default)(services.fileHandlerService.fullPath, {
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
}));
// at the moment not implemented
console.log(services.SupportService);
app.all(`/${services.SupportService.name}/${services.SupportService.version}/*`, (0, express_http_proxy_1.default)(services.SupportService.fullPath, {
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
app.use(express_1.default.json({ limit: FILE_LIMIT_SIZE }));
app.use(express_1.default.urlencoded({ limit: FILE_LIMIT_SIZE, extended: true }));
http_1.default.createServer(app).listen(port, function () {
    console.log("Express server listening on port " + port);
});
