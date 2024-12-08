"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const deleteDataController_1 = require("../controller/deleteDataController");
const DeleteDatarouter = (0, express_1.Router)();
DeleteDatarouter.delete("/", deleteDataController_1.deleteDataController);
exports.default = DeleteDatarouter;
