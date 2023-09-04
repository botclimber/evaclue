type domain = string | "???"
type port = string | "???"

/**
 * both ApiGatway and microservice must contain same endpoint
 */
type service = {
    name: string,
    version: string,
    port: port,
    domain: domain,
    fullPath: `${domain}:${port}`
  }

// Services
const mainDomain: domain = process.env.HOST || "???"

const resPort: port = process.env.resowners_PORT || "???";
export const ResidenceOwnerService: service = {
    name: "resowners",
    version: "v1",
    port: resPort,
    domain: mainDomain,
    fullPath: `${mainDomain}:${resPort}`
};

const geoPort: port = process.env.geo_PORT || "???"
export const GeoLocationService: service = {
    name: "geo",
    version: "v1",
    port: geoPort,
    domain: mainDomain,
    fullPath: `${mainDomain}:${geoPort}`
}

const usersPort: port = process.env.users_PORT || "???"
export const UsersService: service = {
    name:"users",
    version: "v1",
    port: usersPort,
    domain: mainDomain,
    fullPath: `${mainDomain}:${usersPort}`
}

const notificationsPort: port = process.env.not_PORT || "???"
export const NotificationsService: service = {
    name: "notifications",
    version: "v1",
    port: notificationsPort,
    domain: mainDomain,
    fullPath: `${mainDomain}:${notificationsPort}`
}

const reviewsPort: port = process.env.rev_PORT || "???"
export const ReviewsService: service = {
    name: "reviews",
    version: "v2",
    port: reviewsPort,
    domain: mainDomain,
    fullPath: `${mainDomain}:${reviewsPort}`
}

const supportPort: port = process.env.supp_PORT || "???"
export const SupportService: service = {
    name: "support",
    version: "v1",
    port: supportPort,
    domain: mainDomain,
    fullPath:  `${mainDomain}:${supportPort}`
}

const fileHandlerPort: port = process.env.fileHandler_PORT || "???"
export const fileHandlerService: service = {
    name: "fileHandler",
    version: "v1",
    port: fileHandlerPort,
    domain: mainDomain,
    fullPath:  `${mainDomain}:${fileHandlerPort}`
}

//const FileHandlerService // for now cant be accessed directly
//const SchedulerService // only for scheduler purposes, at the moment setup is made programatcly