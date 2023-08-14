"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
//import getRoutes from "./routes/get/getRequests";
const postRequests_1 = __importDefault(require("./routes/post/postRequests"));
//import patchRoutes from "./routes/patch/patchRequests";
const app = (0, express_1.default)();
const port = process.env.PORT || 8049;
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
app.use((0, express_fileupload_1.default)());
const version = "v1";
const service = "fileHandler";
//app.use(`/${version}/${service}/`, getRoutes)   // GET
app.use(`/${version}/${service}/`, postRequests_1.default); // POST
//app.use(`/${version}/${service}/`, patchRoutes) // PATCH
app.listen(port, () => {
    console.log(`FileHandler Service listening to port: ${port}`);
});
