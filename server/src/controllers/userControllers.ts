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