import express from "express"
import { auth } from "../middleware/auth";
import { editProfile, getUserData } from "../controllers/userControllers";

const router = express.Router();

router.get('/:id', getUserData);
router.put('/:id', editProfile);

export default router;