import express from "express"
import { auth } from "../middleware/auth";
import { createNote, deleteNote, getNotes } from "../controllers/noteControllers";

const router = express.Router();

router.post('/createNote', auth, createNote);
router.get('/:userId', getNotes);
router.delete('/:id', deleteNote);

export default router;