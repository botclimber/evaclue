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
exports.FileHandlerActions = void 0;
const path = __importStar(require("path"));
const FileHandlerHelper_1 = require("./FileHandlerHelper");
class FileHandlerActions {
    async saveImgFiles(id, files, limit, prefix, folderPath) {
        try {
            console.log(files);
            const castedFiles = (await FileHandlerHelper_1.fHelper.castFilesType(files)).filter(r => FileHandlerHelper_1.fHelper.onlyAllowedImgs(path.extname(r.name)));
            if (castedFiles.length === 0)
                return { status: 400, msg: "No files sent or not allowed extension" };
            if (castedFiles.length > limit)
                return { status: 400, msg: `We only accept at maximum ${limit} images!` };
            console.log(`Check if path exists if not create it`);
            await FileHandlerHelper_1.fHelper.orCreateFolder(folderPath);
            // create folder for the specific review containing images
            const newFolderName = `${prefix}-${id}/`;
            const newFolderPath = `${folderPath}${newFolderName}`;
            const folderAlreadyExists = await FileHandlerHelper_1.fHelper.orCreateFolder(newFolderPath);
            if (folderAlreadyExists)
                return { status: 400, msg: `Folder for that ${prefix} id already existing!` };
            console.log(`Rename images and change its extension`);
            const eFiles = await FileHandlerHelper_1.fHelper.rnExtension(castedFiles, "rImg", "gif");
            console.log(eFiles);
            console.log(`moving file(s) to ${newFolderPath}`);
            eFiles.forEach(file => {
                file.mv(newFolderPath + file.name, (err) => {
                    if (err)
                        throw err;
                    else
                        return true;
                });
            });
            return { status: 200, msg: "Images added!" };
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    }
}
exports.FileHandlerActions = FileHandlerActions;
