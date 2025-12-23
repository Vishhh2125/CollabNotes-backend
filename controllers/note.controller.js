import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Note from "../models/note.model.js";
import Tenant from "../models/tenant.model.js";



const createNote=asyncHandler(async(req,res)=>{

    const {title,content}= req.body;
    const {tenantId}= req.params;
    const userId = req.user._id;

    if(!tenantId) throw new ApiError(400,"Tenant ID is required");
    if(!title) throw new ApiError(400,"Note title is required");
    if(!content) throw new ApiError(400,"Note content is required");

    const tenant = await Tenant.findById(tenantId);
    if(!tenant) throw new ApiError(404,"Tenant not found");

    if(tenant.plan === "free") {
        const userNotesCount = await Note.countDocuments({ 
            tenantId, 
            createdBy: userId 
        });

        if(userNotesCount >= 3) {
            throw new ApiError(
                403, 
                "Free plan is limited to 3 notes per user. Upgrade to Pro for unlimited notes."
            );
        }
    }

    await Note.create({
      tenantId,
      createdBy: userId,
       title,
       content
  })

    return res.status(201).json(
        new ApiResponse(201,{},"Note created successfully")
    );  
})



const getAllNotes=asyncHandler(async(req,res)=>{
    
    const {tenantId}= req.params;

    if(!tenantId) throw new ApiError(400,"Tenant ID is required");


    const notes= await Note.find({tenantId})
        .populate('createdBy', 'username email')
        .sort({ createdAt: -1 });


    return res.status(200).json(
        new ApiResponse(200,notes,"Notes fetched successfully")
    );      
})



const editNote = asyncHandler(async(req,res)=>{

    const {noteId}= req.params;
    const {title,content}= req.body;

    if(!noteId) throw new ApiError(400,"Note ID is required");
    if(!title) throw new ApiError(400,"Note title is required");
    if(!content) throw new ApiError(400,"Note content is required");

    const updatedNote = await Note.findByIdAndUpdate(noteId, {
        title,
        content,
    });

    if(!updatedNote) throw new ApiError(404,"Note not found");

    return res.status(200).json(
        new ApiResponse(200,{},"Note updated successfully")
    );  
})


const deleteNote= asyncHandler(async(req,res)=>{

    const {noteId}= req.params;

    if(!noteId) throw new ApiError(400,"Note ID is required");

        const deleteNote= await Note.findByIdAndDelete(noteId);

        if(!deleteNote) throw new ApiError(404,"Note not found");

    return res.status(200).json(
        new ApiResponse(200,{},"Note deleted successfully")
    );
})


export {createNote,getAllNotes,editNote,deleteNote};