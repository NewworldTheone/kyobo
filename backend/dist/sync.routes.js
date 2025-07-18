"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("./auth.middleware");
const sync_controller_1 = require("./sync.controller");
const router = express_1.default.Router();
router.post('/sync', auth_middleware_1.authenticate, sync_controller_1.syncOfflineActions);
exports.default = router;
