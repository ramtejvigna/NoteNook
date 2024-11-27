import User from "../models/User";
import Note from "../models/Note";
import { Request, Response } from "express";

export const createNote = async (req: Request, res: Response ): Promise<void> => {
    try {
        const user = await User.findById(req.body.userId);

        if(!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const note = new Note({
            ...req.body,
            userId: user._id
        });
        await note.save();

        user.notes.push(note._id);
        user.save();

        res.status(200).send(note);
    } catch (error) {
        res.status(400).send({ error: 'Error creating note' });
    }
}

export const getNotes = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params; // Extract userId from route parameters
        const notes = await Note.find({ userId: userId });

        res.status(200).send(notes);
    } catch (error) {
        res.status(400).send({ error: 'Error fetching notes' });
    }
};


export const deleteNote = async (req: Request, res: Response): Promise<void> => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id);

        if (!note) {
            res.status(404).send({ error: 'Note not found' });
            return;
        }

        // Remove the note ID from the user's notes array
        await User.updateOne(
            { _id: note.userId }, 
            { $pull: { notes: note._id } } // Remove the note ID from the notes array
        );

        res.status(200).send({ message: 'Note Deleted Successfully' });
    } catch (error) {
        res.status(400).send({ error: 'Error deleting note' });
    }
};
