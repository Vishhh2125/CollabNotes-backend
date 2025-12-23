import {Router} from 'express';
import  {createNote,getAllNotes,editNote,deleteNote} from '../controllers/note.controller.js';
import verifyJWT from '../middlewares/authMiddleware.js';
import checkAccess from '../middlewares/authorizationMiddleware.js';
const router=Router();




router.route("/create/:tenantId").post(verifyJWT, checkAccess, createNote)
router.route("/delete/:tenantId/:noteId").delete(verifyJWT, checkAccess, deleteNote)
router.route("/edit/:tenantId/:noteId").patch(verifyJWT, checkAccess, editNote)
router.route("/get-all/:tenantId").get(verifyJWT, checkAccess, getAllNotes)

export default router;