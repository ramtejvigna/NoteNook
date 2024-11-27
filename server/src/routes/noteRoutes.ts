import express from "express"
import { auth } from "../middleware/auth";
import { createNote, deleteNote, editNote, getNotes } from "../controllers/noteControllers";

const router = express.Router();

router.post('/createNote', auth, createNote);
router.get('/:userId', getNotes);
router.delete('/:id', deleteNote);
router.put('/:id', editNote)

export default router;