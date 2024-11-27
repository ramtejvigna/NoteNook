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

export const editNote = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params; // Extract note ID from the request params
        const { title, content } = req.body; // Extract title and content from the request body

        // Find the note by ID
        const note = await Note.findById(id);

        if (!note) {
            res.status(404).send({ error: 'Note not found' });
            return;
        }

        // Update the note fields if they are provided
        if (title) note.title = title;
        if (content) note.content = content;

        // Save the updated note
        const updatedNote = await note.save();

        // Send the updated note back to the client
        res.status(200).send({
            message: 'Note updated successfully',
            note: updatedNote,
        });
    } catch (error) {
        res.status(500).send({
            error: 'An error occurred while updating the note',
        });
    }
};
