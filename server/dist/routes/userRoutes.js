"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const userControllers_1 = require("../controllers/userControllers");
const router = express_1.default.Router();
router.get('/:id', auth_1.auth, userControllers_1.getUserData);
router.put('/:id', auth_1.auth, userControllers_1.editProfile);
exports.default = router;
