"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const getRequests_1 = __importDefault(require("./routes/get/getRequests"));
const postRequests_1 = __importDefault(require("./routes/post/postRequests"));
const patchRequests_1 = __importDefault(require("./routes/patch/patchRequests"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const app = (0, express_1.default)();
const port = process.env.rev_PORT || 8000;
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use((0, cors_1.default)());
app.use((0, express_fileupload_1.default)());
app.use(express_1.default.static(__dirname + '/public'));
const version = "v2";
const service = "reviews";
app.use(`/${service}/${version}/`, getRequests_1.default); // GET
app.use(`/${service}/${version}/`, postRequests_1.default); // POST
app.use(`/${service}/${version}/`, patchRequests_1.default); // PATCH
app.listen(port, () => {
    console.log(`Reviews Service listening to port: ${port}`);
});
