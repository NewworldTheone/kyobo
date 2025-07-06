"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("./admin.controller");
const auth_middleware_1 = require("./auth.middleware");
const router = express_1.default.Router();
// 판매 데이터 관련 라우트
router.get('/sales', auth_middleware_1.authenticate, admin_controller_1.getSalesData);
router.post('/sales', auth_middleware_1.authenticate, admin_controller_1.createSalesRecord);
router.delete('/sales/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['admin']), admin_controller_1.deleteSalesRecord);
// 재고 예측 관련 라우트
router.get('/predictions', auth_middleware_1.authenticate, admin_controller_1.getInventoryPrediction);
// 시스템 설정 관련 라우트
router.get('/settings', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['admin']), admin_controller_1.getSystemSettings);
router.put('/settings/:key', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['admin']), admin_controller_1.updateSystemSetting);
router.delete('/settings/:key', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['admin']), admin_controller_1.deleteSystemSetting);
exports.default = router;
