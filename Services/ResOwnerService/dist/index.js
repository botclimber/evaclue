"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const body_parser_1 = __importDefault(require("body-parser"));
const getRequests_1 = __importDefault(require("./routes/get/getRequests"));
const postRequests_1 = __importDefault(require("./routes/post/postRequests"));
const patchRequests_1 = __importDefault(require("./routes/patch/patchRequests"));
const app = (0, express_1.default)();
const port = process.env.resowners_PORT || 8000;
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
app.use((0, express_fileupload_1.default)());
const version = "v1";
const service = "resowners";
app.use(`/${service}/${version}/`, getRequests_1.default); // GET
app.use(`/${service}/${version}/`, postRequests_1.default); // POST
app.use(`/${service}/${version}/`, patchRequests_1.default); // PATCH
app.listen(port, () => {
    console.log(`ResidenceOwners Service listening to port: ${port}`);
});
