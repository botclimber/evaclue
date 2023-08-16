"use strict";
/**
 *
 * reviews:
 *  - multiple images (max 3)
 *
 * residences:
 *  - multiple images (max 5)
 *
 * residenceOwners:
 *  - one document proof
 *
 * support:
 *  - one attach
 */
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
const reviewFilesLimit = 3;
const resFilesLimit = 5;
const proofDocFileLimit = 1;
const reviewFilePrefix = "review";
const resFilePrefix = "residence";
const proofDocFilePrefix = "proofDoc";
const rFolderPath = path.join(__dirname, "../reviewImgs/");
const resFolderPath = path.join(__dirname, "../resImgs/");
const pDocFolderPath = path.join(__dirname, "../proofDocs/");
const fileHandler = new FileHandlerActions_1.FileHandlerActions();
class FileHandlerController {
    async addReviewImgs(req, res, next) {
        const data = req.body;
        if (data.reviewId) {
            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(errorMessages_1.errorMessages.NO_FILES_FOUND.status).json({ msg: errorMessages_1.errorMessages.NO_FILES_FOUND.text });
            }
            else {
                try {
                    const response = await fileHandler.saveImgFiles(data.reviewId, req.files, reviewFilesLimit, reviewFilePrefix, rFolderPath);
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
            return res.status(errorMessages_1.errorMessages.MISSING_REV_ID.status).json({ msg: errorMessages_1.errorMessages.MISSING_REV_ID.text });
        }
    }
}
exports.FileHandlerController = FileHandlerController;
