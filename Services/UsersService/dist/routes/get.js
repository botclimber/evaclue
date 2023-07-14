"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const routes = (0, express_1.Router)();
routes.get("/changePassword/:email", new UserController_1.UserController().RecoverPasswordEmail);
// routes.get("/profile", authMiddleware, new UserController().getProfile);
