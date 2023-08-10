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
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileHandlerController = void 0;
const FileHandlerActions_1 = require("./FileHandlerActions");
const errorMessages_1 = require("../helpers/errorMessages");
class FileHandlerController {
    constructor() {
        this.FH = new FileHandlerActions_1.FileHandlerActions();
    }
    async addReviewImgs(req, res, next) {
        const data = req.body;
        /**
         * CHECKS:
         *  - if review id exists
         *  - if exist any file otherwise just ignore and do nothing
         *  - check file extensions
         *  - change file extension in case of images to .gif
         *  - check
         */
        if (data.reviewId) {
            if (!req.files || Object.keys(req.files).length === 0)
                return res.status(errorMessages_1.errorMessages.NO_FILES_FOUND.status).json({ msg: errorMessages_1.errorMessages.NO_FILES_FOUND.text });
            else {
                try {
                    const response = await this.FH.addReviewImgs(data.reviewId, req.files);
                    return res.status(200).json({ msg: `Images added!` });
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
    async addResImgs() { }
    async addResDoc() { }
    async getAoOReviewImgs() { }
    async getAoOResImages() { }
    // Only an admin or the file user owner should be able to request a document
    async getAoOResDocs() { }
}
exports.FileHandlerController = FileHandlerController;
