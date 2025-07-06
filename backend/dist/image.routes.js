"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const image_controller_1 = require("./image.controller");
const auth_middleware_1 = require("./auth.middleware");
const router = express_1.default.Router();
// 제품 이미지 업로드 (제품 사진 또는 위치 사진)
router.post('/product', auth_middleware_1.authenticate, image_controller_1.upload.single('image'), image_controller_1.uploadProductImage);
// 매장/창고 레이아웃 이미지 업로드
router.post('/layout', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['admin']), image_controller_1.upload.single('image'), image_controller_1.uploadLayoutImage);
// 이미지 삭제
router.delete('/', auth_middleware_1.authenticate, image_controller_1.deleteImage);
exports.default = router;
