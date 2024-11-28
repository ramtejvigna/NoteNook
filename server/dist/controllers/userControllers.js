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
exports.editProfile = exports.getUserData = void 0;
const User_1 = __importDefault(require("../models/User"));
const getUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield User_1.default.findById(id).populate("notes");
        if (!user) {
            res.status(400).send({ message: "User not found" });
            return;
        }
        res.status(200).send(user);
    }
    catch (error) {
        res.status(500).send({ error: "Error Fetching user Data" });
    }
});
exports.getUserData = getUserData;
const editProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Extract note ID from the request params
        const { fullName, dateOfBirth, email } = req.body; // Extract title and content from the request body
        // Find the note by ID
        const user = yield User_1.default.findById(id);
        if (!user) {
            res.status(404).send({ error: 'User not found' });
            return;
        }
        // Update the note fields if they are provided
        if (fullName)
            user.fullName = fullName;
        if (dateOfBirth)
            user.dateOfBirth = dateOfBirth;
        if (email)
            user.email = email;
        // Save the updated note
        const updatedUser = yield user.save();
        // Send the updated note back to the client
        res.status(200).send({
            message: 'Profile updated successfully',
            user: updatedUser,
        });
    }
    catch (error) {
        res.status(500).send({ error: "Failed to update profile" });
    }
});
exports.editProfile = editProfile;
