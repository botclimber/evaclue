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
const app = (0, express_1.default)();
// Views // only for dev purposes
const mainPlatform = `${process.env.HOST}:${process.env.mainPage_PORT}`;
const authPlatform = `${process.env.HOST}:${process.env.loginPage_PORT}`;
const adminPlatform = `${process.env.HOST}:${process.env.adminPage_PORT}`;
/**
 * Reverse proxying to serve views
 *
 */
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
app.get('/admin*', function (req, res) {
    console.log("serving admin page");
    const url = req.url.substring(6);
    res.redirect(`${adminPlatform}${url}`);
});
/**
 * Reverse proxying to services
 *
 */
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
// at the moment not implemented
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
http_1.default.createServer(app).listen(port, function () {
    console.log("Express server listening on port " + port);
});