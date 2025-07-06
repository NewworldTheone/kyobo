"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("./auth.middleware");
const product_controller_1 = require("./product.controller");
const upload_controller_1 = require("./upload.controller");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
// 제품 조회 및 검색
router.get('/', auth_middleware_1.authenticate, product_controller_1.getAllProducts);
router.get('/export', auth_middleware_1.authenticate, product_controller_1.exportProducts);
router.get('/:id', auth_middleware_1.authenticate, product_controller_1.getProductById);
router.get('/:id/location-history', auth_middleware_1.authenticate, product_controller_1.getLocationHistory);
// 제품 생성, 수정, 삭제 (관리자 권한 필요)
router.post('/', auth_middleware_1.authenticate, auth_middleware_1.authorizeAdmin, product_controller_1.createProduct);
router.put('/:id', auth_middleware_1.authenticate, auth_middleware_1.authorizeAdmin, product_controller_1.updateProduct);
router.delete('/:id', auth_middleware_1.authenticate, auth_middleware_1.authorizeAdmin, product_controller_1.deleteProduct);
// 재고 조정 및 위치 변경
router.post('/:id/adjust', auth_middleware_1.authenticate, product_controller_1.adjustInventory);
router.post('/:id/move', auth_middleware_1.authenticate, product_controller_1.moveProductLocation);
// 대량 업로드
router.post('/bulk-upload', auth_middleware_1.authenticate, auth_middleware_1.authorizeAdmin, upload.single('file'), upload_controller_1.bulkUploadProducts);
exports.default = router;
