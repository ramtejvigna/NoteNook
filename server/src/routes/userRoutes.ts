import express from "express"
import { auth } from "../middleware/auth";
import { editProfile, getUserData } from "../controllers/userControllers";

const router = express.Router();

router.get('/:id', auth, getUserData);
router.put('/:id', auth, editProfile);

export default router;