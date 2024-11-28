"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editNote = exports.deleteNote = exports.getNotes = exports.createNote = void 0;
const User_1 = __importDefault(require("../models/User"));
const Note_1 = __importDefault(require("../models/Note"));
const createNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.body.userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const note = new Note_1.default(Object.assign(Object.assign({}, req.body), { userId: user._id }));
        yield note.save();
        user.notes.push(note._id);
        user.save();
        res.status(200).send(note);
    }
    catch (error) {
        res.status(400).send({ error: 'Error creating note' });
    }
});
exports.createNote = createNote;
const getNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params; // Extract userId from route parameters
        const notes = yield Note_1.default.find({ userId: userId });
        res.status(200).send(notes);
    }
    catch (error) {
        res.status(400).send({ error: 'Error fetching notes' });
    }
});
exports.getNotes = getNotes;
const deleteNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const note = yield Note_1.default.findByIdAndDelete(req.params.id);
        if (!note) {
            res.status(404).send({ error: 'Note not found' });
            return;
        }
        // Remove the note ID from the user's notes array
        yield User_1.default.updateOne({ _id: note.userId }, { $pull: { notes: note._id } } // Remove the note ID from the notes array
        );
        res.status(200).send({ message: 'Note Deleted Successfully' });
    }
    catch (error) {
        res.status(400).send({ error: 'Error deleting note' });
    }
});
exports.deleteNote = deleteNote;
const editNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Extract note ID from the request params
        const { title, content } = req.body; // Extract title and content from the request body
        // Find the note by ID
        const note = yield Note_1.default.findById(id);
        if (!note) {
            res.status(404).send({ error: 'Note not found' });
            return;
        }
        // Update the note fields if they are provided
        if (title)
            note.title = title;
        if (content)
            note.content = content;
        // Save the updated note
        const updatedNote = yield note.save();
        // Send the updated note back to the client
        res.status(200).send({
            message: 'Note updated successfully',
            note: updatedNote,
        });
    }
    catch (error) {
        res.status(500).send({
            error: 'An error occurred while updating the note',
        });
    }
});
exports.editNote = editNote;
