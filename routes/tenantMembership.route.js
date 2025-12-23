import { Router } from "express";
import {getAllTenantsMembership, addMemberToTenant, changeMemberRole,removeMembership} from "../controllers/tenantMembership.controller.js";
import verifyJWT from "../middlewares/authMiddleware.js";
import checkAccess from "../middlewares/authorizationMiddleware.js";
const router = Router();





router.route("/:tenantId").get(verifyJWT, checkAccess, getAllTenantsMembership) //get all memberships as per tenant 
router.route("/:tenantId").post(verifyJWT, checkAccess, addMemberToTenant) //add memeber ship for a tenant 
router.route("/:tenantId").delete(verifyJWT, checkAccess, removeMembership) //remove membership for a tenant
router.route("/role/:tenantId").put(verifyJWT, checkAccess, changeMemberRole) //change role of member for a tenant





export default router;