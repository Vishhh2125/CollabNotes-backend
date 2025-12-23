import TenantMembership from "../models/tenantMembership.model.js";

const checkAccess = async (req, res, next) => {
    try {
        const method = req.method;
        const url = req.originalUrl.split('?')[0];
        const tenantId = req.params.tenantId;
        const userId = req.user._id;

        let allowedRoles = [];

        if (url.startsWith("/api/v1/notes/")) {
            allowedRoles = ["admin", "member"];
        }

        else if (url.startsWith("/api/v1/tenant-membership/")) {
            allowedRoles = ["admin"];
        }

        else if (method === "DELETE" && url.startsWith("/api/v1/tenants/delete/")) {
            allowedRoles = ["admin"];
        }
        else if(method==="PATCH" && url.startsWith("/api/v1/tenants/edit/subscription/")){
            allowedRoles=["admin"];
        }

        else {
            return next();
        }

        
        if (!tenantId) {
            return res.status(400).json({ success: false, message: "Tenant ID is required" });
        }

     
        const membership = await TenantMembership.findOne({ tenantId, userId });

        if (!membership) {
            return res.status(403).json({ success: false, message: "unauthorized to this route" });
        }

        if (!allowedRoles.includes(membership.role)) {
            return res.status(403).json({ 
                success: false, 
                message: "Insufficient permissions to access this route"
            });
        }

        req.userRole = membership.role;
        req.membership = membership;
        next();

    } catch (error) {
        console.error("Authorization error:", error);
        res.status(500).json({ success: false, message: "Authorization failed" });
    }
};

export default checkAccess;
