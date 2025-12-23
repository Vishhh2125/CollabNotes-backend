import { Router } from "express";
import { createTenant,deleteTenant,getAllTenants ,editTenantSubscription} from "../controllers/tenant.controller.js";
import verifyJWT from "../middlewares/authMiddleware.js";
import checkAccess from "../middlewares/authorizationMiddleware.js";
const router = Router();



router.route("/create").post(verifyJWT, createTenant);
router.route("/delete/:tenantId").delete(verifyJWT,checkAccess, deleteTenant);
// router.route("/get/:tenantId").get();
router.route("/get-all").get(verifyJWT, getAllTenants);  //all tenant  as per user who is there 
router.route("/edit/subscription/:tenantId").patch(verifyJWT, checkAccess, editTenantSubscription);
export default router;