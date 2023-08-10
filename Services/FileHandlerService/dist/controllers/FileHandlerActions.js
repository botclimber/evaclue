"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileHandlerActions = void 0;
const Db_1 = require("../db/Db");
class FileHandlerActions {
    constructor() {
        this.db = new Db_1.Db();
        this.rFolderName = "reviewsImgs/";
        this.resFolderName = "residenceImgs/";
        this.pDocFolderName = "proofDocuments/";
    }
    async addReviewImgs(reviewId, files) {
        return true;
    }
    async addResImgs() { }
    async addResDoc() { }
    async getAoOReviewImgs() { }
    async getAoOResImages() { }
    async getAoOResDocs() { }
}
exports.FileHandlerActions = FileHandlerActions;
