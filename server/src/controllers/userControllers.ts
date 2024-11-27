import User from "../models/User";
import Note from "../models/Note";
import { Request, Response } from "express";

export const getUserData = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).populate("notes");

        if(!user) {
            res.status(400).send({ message: "User not found" });
            return;
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ error: "Error Fetching user Data" });
    }
}

export const editProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params; // Extract note ID from the request params
        const { fullName, dateOfBirth, email } = req.body; // Extract title and content from the request body

        // Find the note by ID
        const user = await User.findById(id);

        if (!user) {
            res.status(404).send({ error: 'User not found' });
            return;
        }

        // Update the note fields if they are provided
        if (fullName) user.fullName = fullName;
        if (dateOfBirth) user.dateOfBirth = dateOfBirth;
        if (email) user.email = email;

        // Save the updated note
        const updatedUser = await user.save();

        // Send the updated note back to the client
        res.status(200).send({
            message: 'Profile updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).send({ error: "Failed to update profile" });
    }
}