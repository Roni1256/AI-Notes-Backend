import { Note } from "../models/notes.model.js";
import User from "../models/user.model.js";

export const createNote = async (req, res) => {
    try {
        const {title,notes,tags,user,category,notesId}=req.body;
        if (!title || !notes || !user) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const isUser=await User.findById(user);
        if (!isUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const note = await Note.create({title,notes,tags,category,user});
        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ user: req.params.id });
        if (!notes) {
            return res.status(404).json({ message: "Notes not found" });
        }
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getNoteById = async (req, res) => {
    try {
        const {id}=req.params;
        const isUser=await User.findById(id)
        if(!isUser){
            return res.status(404).json({ message: "User not found" });
        }
        const note = await Note.find({user:id});
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateNote = async (req, res) => {
    try {
        const {notesId}=req.params;
        const {title,notes,tags,user,category}=req.body;
        const note=await Note.findById(notesId);
        if(!note){
            return res.status(404).json({ message: "Note not found" });
        }
        const updated=await Note.findByIdAndUpdate(notesId,{title,notes,tags,category,user});
        return res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteNote = async (req, res) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getNoteByFileId=async(req,res)=>{
    try {
        const {id,fileId}=req.params;
        const note = await Note.findOne({user:id,_id:fileId});
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json(note);

    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}