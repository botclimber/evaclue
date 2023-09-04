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
const enums_1 = require("../helpers/enums");
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
        const content = (!Array.isArray(files)) ? [files] : files;
        return content;
    };
    fHelper.onlyAllowed = (fExt, fType) => {
        switch (fType) {
            case enums_1.fileType.IMG:
                return fHelper.allowedImgExtensions.includes(fExt);
            case enums_1.fileType.DOC:
                return fHelper.allowedDocExtensions.includes(fExt);
            case enums_1.fileType.ATTACH:
                return [...fHelper.allowedImgExtensions, ...fHelper.allowedDocExtensions].includes(fExt);
            default: return false;
        }
    };
    fHelper.alternativeExt = async (fType) => {
        switch (fType) {
            case enums_1.fileType.IMG:
                return "gif";
            case enums_1.fileType.DOC:
                return "pdf";
            default: return undefined;
        }
    };
})(fHelper || (exports.fHelper = fHelper = {}));
