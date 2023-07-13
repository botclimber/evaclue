"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const routes = (0, express_1.Router)();
routes.post("/register/user", new UserController_1.UserController().registUser);
routes.post("/login/user", new UserController_1.UserController().loginUser);
// routes.post("/register/admin", new UserController().registAdmin);
// routes.post("/login/admin", new UserController().loginAdmin);
// routes.post(
//   "/updatePassword/:userId/:emailToken",
//   new UserController().updateUserPassword
// );
exports.default = routes;
