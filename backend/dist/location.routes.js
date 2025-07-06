"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const location_controller_1 = require("./location.controller");
const auth_middleware_1 = require("./auth.middleware");
const router = express_1.default.Router();
// 레이아웃 관련 라우트
router.get('/layouts', auth_middleware_1.authenticate, location_controller_1.getLayouts);
router.get('/layouts/:id', auth_middleware_1.authenticate, location_controller_1.getLayoutById);
router.post('/layouts', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['admin']), location_controller_1.createLayout);
router.put('/layouts/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['admin']), location_controller_1.updateLayout);
router.delete('/layouts/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['admin']), location_controller_1.deleteLayout);
// 제품 위치 관련 라우트
router.put('/products/:id/location', auth_middleware_1.authenticate, location_controller_1.updateProductLocation);
router.get('/products/:id/history', auth_middleware_1.authenticate, location_controller_1.getProductLocationHistory);
router.get('/layouts/:layoutId/products', auth_middleware_1.authenticate, location_controller_1.getProductsByLayout);
exports.default = router;
