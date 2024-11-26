import User from "../models/User";
import Note from "../models/Note";
import { Request, Response } from "express";

export const createNote = async (req: Request, res: Response ): Promise<void> => {
    try {
        const note = new Note({
            ...req.body,
            userId: req.body.userId
        });
        await note.save();

        res.status(200).send(note);
    } catch (error) {
        res.status(400).send({ error: 'Error creating note' });
    }
}

export const getNotes = async (req: Request, res: Response): Promise<void> => {
    try {
        const notes = await Note.find({ userId: req.body.userId });

        res.status(200).send(notes);
    } catch (error) {
        res.status(400).send({ error: 'Error fetching notes' });
    }
}

export const deleteNote = async (req: Request, res: Response): Promise<void> => {
    try {
        const note = await Note.findOneAndDelete({
            _id: req.params.id,
        })

        if (!note) {
            res.status(404).send({ error: 'Note not found' });
            return;
        }
        
        res.status(200).send({message: 'Note Deleted Successfully'});
    } catch (error) {
        res.status(400).send({ error: 'Error deleting note'});
    }
}