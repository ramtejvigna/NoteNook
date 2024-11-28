import express from "express"
import { auth } from "../middleware/auth";
import { createNote, deleteNote, editNote, getNotes } from "../controllers/noteControllers";

const router = express.Router();

router.post('/createNote', auth, createNote);
router.get('/:userId', auth, getNotes);
router.delete('/:id', auth, deleteNote);
router.put('/:id', auth, editNote)

export default router;