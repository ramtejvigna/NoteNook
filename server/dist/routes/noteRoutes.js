"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const noteControllers_1 = require("../controllers/noteControllers");
const router = express_1.default.Router();
router.post('/createNote', auth_1.auth, noteControllers_1.createNote);
router.get('/:userId', noteControllers_1.getNotes);
router.delete('/:id', noteControllers_1.deleteNote);
router.put('/:id', noteControllers_1.editNote);
exports.default = router;
