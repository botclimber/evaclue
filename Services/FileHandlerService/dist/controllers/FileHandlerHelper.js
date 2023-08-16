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
exports.fHelper = void 0;
const fs = __importStar(require("fs"));
var fHelper;
(function (fHelper) {
    fHelper.allowedImgExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    fHelper.allowedDocExtensions = [".pdf"];
    fHelper.orCreateFolder = async (path) => {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
            return false;
        }
        else
            return true;
    };
    fHelper.rnExtension = async (files, name, ext) => {
        for (const x in files) {
            const newFileName = `${name}-${x}.${ext}`;
            files[x].name = newFileName;
        }
        return files;
    };
    fHelper.castFilesType = async (files) => {
        if (!Array.isArray(files.reviewImgs))
            return [files.reviewImgs];
        return files.reviewImgs;
    };
    fHelper.onlyAllowedImgs = (fExt) => {
        if (fHelper.allowedImgExtensions.includes(fExt))
            return true;
        else
            return false;
    };
    fHelper.onlyAllowedDocs = (fExt) => {
        if (fHelper.allowedDocExtensions.includes(fExt))
            return true;
        else
            return false;
    };
})(fHelper || (exports.fHelper = fHelper = {}));