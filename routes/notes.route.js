import { Router } from "express";
import { createNote, deleteNote, getNoteByFileId, getNoteById, getNotes, updateNote } from "../controllers/notes.controller.js";

const router = Router();
router.post('/note',createNote);
router.get('/all/:id',getNoteById);
router.delete('/:id',deleteNote)
router.put('/note/:notesId',updateNote)
router.get('/:id/:fileId',getNoteByFileId)
export default router;
