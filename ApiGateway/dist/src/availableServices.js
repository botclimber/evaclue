"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportService = exports.ReviewsService = exports.NotificationsService = exports.UsersService = exports.GeoLocationService = exports.ResidenceOwnerService = void 0;
// Services
const mainDomain = process.env.HOST || "???";
const resPort = process.env.resowner_PORT || "???";
exports.ResidenceOwnerService = {
    name: "resowners",
    version: "v1",
    port: resPort,
    domain: mainDomain,
    fullPath: `${mainDomain}:${resPort}`
};
const geoPort = process.env.geo_PORT || "???";
exports.GeoLocationService = {
    name: "geo",
    version: "v1",
    port: geoPort,
    domain: mainDomain,
    fullPath: `${mainDomain}:${geoPort}`
};
const usersPort = process.env.users_PORT || "???";
exports.UsersService = {
    name: "users",
    version: "v1",
    port: usersPort,
    domain: mainDomain,
    fullPath: `${mainDomain}:${usersPort}`
};
const notificationsPort = process.env.not_PORT || "???";
exports.NotificationsService = {
    name: "notifications",
    version: "v1",
    port: notificationsPort,
    domain: mainDomain,
    fullPath: `${mainDomain}:${notificationsPort}`
};
const reviewsPort = process.env.rev_PORT || "???";
exports.ReviewsService = {
    name: "reviews",
    version: "v2",
    port: reviewsPort,
    domain: mainDomain,
    fullPath: `${mainDomain}:${reviewsPort}`
};
const supportPort = process.env.supp_PORT || "???";
exports.SupportService = {
    name: "support",
    version: "v1",
    port: supportPort,
    domain: mainDomain,
    fullPath: `${mainDomain}:${supportPort}`
};
//const FileHandlerService // for now cant be accessed directly
//const SchedulerService // only for scheduler purposes, at the moment setup is made programatcly
