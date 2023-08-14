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
                    console.log(req.files.reviewImgs);
                    const response = await fileHandler.saveReviewImgs(data.reviewId, req.files);
                    console.log(response);
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
}
exports.FileHandlerController = FileHandlerController;
