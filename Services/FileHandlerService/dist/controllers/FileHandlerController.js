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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileHandlerController = void 0;
const FileHandlerActions_1 = require("./FileHandlerActions");
const errorMessages_1 = require("../helpers/errorMessages");
const path = __importStar(require("path"));
const enums_1 = require("../helpers/enums");
const REVIEWS = {
    prefix: "review",
    path: path.join(__dirname, "../reviewImgs/"),
    limit: 3,
    fType: enums_1.fileType.IMG,
    paramName: "reviewImgs"
};
const RESIDENCES = {
    prefix: "residence",
    path: path.join(__dirname, "../resImgs/"),
    limit: 5,
    fType: enums_1.fileType.IMG,
    paramName: "resImgs"
};
const PROOFDOCS = {
    prefix: "proofDoc",
    path: path.join(__dirname, "../proofDocs/"),
    limit: 1,
    fType: enums_1.fileType.DOC,
    paramName: "proofDocFiles"
};
const TICKETS = {
    prefix: "ticket",
    path: path.join(__dirname, "../ticketAttachments/"),
    limit: 1,
    fType: enums_1.fileType.ATTACH,
    paramName: "ticketAttachFiles"
};
const fileHandler = new FileHandlerActions_1.FileHandlerActions();
class FileHandlerController {
    async addReviewImgs(req, res, next) {
        const data = req.body;
        if (data.reviewId) {
            if (!req.files || Object.keys(req.files).length === 0 || !Object.keys(req.files).includes(REVIEWS.paramName)) {
                return res.status(errorMessages_1.errorMessages.NO_FILES_OR_KEY.status).json({ msg: errorMessages_1.errorMessages.NO_FILES_OR_KEY.text });
            }
            else {
                try {
                    const response = await fileHandler.saveFiles(data.reviewId, req.files[REVIEWS.paramName], REVIEWS.limit, REVIEWS.prefix, REVIEWS.path, REVIEWS.fType);
                    console.log(response);
                    if (response.status === 200)
                        return res.status(response.status).json({ msg: response.msg });
                    else
                        return res.status(response.status).json({ msg: response.msg });
                }
                catch (e) {
                    console.log(e);
                    throw e;
                }
            }
        }
        else {
            return res.status(errorMessages_1.errorMessages.MISSING_ID_PARAM.status).json({ msg: errorMessages_1.errorMessages.MISSING_ID_PARAM.text });
        }
    }
    async addResImgs(req, res, next) {
        const data = req.body;
        if (data.resId) {
            if (!req.files || Object.keys(req.files).length === 0 || !Object.keys(req.files).includes(RESIDENCES.paramName)) {
                return res.status(errorMessages_1.errorMessages.NO_FILES_OR_KEY.status).json({ msg: errorMessages_1.errorMessages.NO_FILES_OR_KEY.text });
            }
            else {
                try {
                    const response = await fileHandler.saveFiles(data.resId, req.files[RESIDENCES.paramName], RESIDENCES.limit, RESIDENCES.prefix, RESIDENCES.path, RESIDENCES.fType);
                    console.log(response);
                    if (response.status === 200)
                        return res.status(response.status).json({ msg: response.msg });
                    else
                        return res.status(response.status).json({ msg: response.msg });
                }
                catch (e) {
                    console.log(e);
                    throw e;
                }
            }
        }
        else {
            return res.status(errorMessages_1.errorMessages.MISSING_ID_PARAM.status).json({ msg: errorMessages_1.errorMessages.MISSING_ID_PARAM.text });
        }
    }
    async addResDoc(req, res, next) {
        const data = req.body;
        if (data.resId) {
            if (!req.files || Object.keys(req.files).length === 0 || !Object.keys(req.files).includes(PROOFDOCS.paramName)) {
                return res.status(errorMessages_1.errorMessages.NO_FILES_OR_KEY.status).json({ msg: errorMessages_1.errorMessages.NO_FILES_OR_KEY.text });
            }
            else {
                try {
                    const response = await fileHandler.saveFiles(data.resId, req.files[PROOFDOCS.paramName], PROOFDOCS.limit, PROOFDOCS.prefix, PROOFDOCS.path, PROOFDOCS.fType);
                    console.log(response);
                    if (response.status === 200)
                        return res.status(response.status).json({ msg: response.msg });
                    else
                        return res.status(response.status).json({ msg: response.msg });
                }
                catch (e) {
                    console.log(e);
                    throw e;
                }
            }
        }
        else {
            return res.status(errorMessages_1.errorMessages.MISSING_ID_PARAM.status).json({ msg: errorMessages_1.errorMessages.MISSING_ID_PARAM.text });
        }
    }
    async addTicketAttachment(req, res, next) {
        const data = req.body;
        if (data.ticketId) {
            if (!req.files || Object.keys(req.files).length === 0 || !Object.keys(req.files).includes(TICKETS.paramName)) {
                return res.status(errorMessages_1.errorMessages.NO_FILES_OR_KEY.status).json({ msg: errorMessages_1.errorMessages.NO_FILES_OR_KEY.text });
            }
            else {
                try {
                    const response = await fileHandler.saveFiles(data.ticketId, req.files[TICKETS.paramName], TICKETS.limit, TICKETS.prefix, TICKETS.path, TICKETS.fType);
                    console.log(response);
                    if (response.status === 200)
                        return res.status(response.status).json({ msg: response.msg });
                    else
                        return res.status(response.status).json({ msg: response.msg });
                }
                catch (e) {
                    console.log(e);
                    throw e;
                }
            }
        }
        else {
            return res.status(errorMessages_1.errorMessages.MISSING_ID_PARAM.status).json({ msg: errorMessages_1.errorMessages.MISSING_ID_PARAM.text });
        }
    }
}
exports.FileHandlerController = FileHandlerController;
