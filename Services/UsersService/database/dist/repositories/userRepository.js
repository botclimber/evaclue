"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = void 0;
const data_source_1 = require("../data-source");
const Users_1 = require("../entities/Users");
exports.userRepository = data_source_1.myDataSource.getRepository(Users_1.User);
