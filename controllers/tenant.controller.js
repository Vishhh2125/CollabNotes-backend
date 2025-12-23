import Tenant from "../models/tenant.model.js";
import TenantMembership from "../models/tenantMembership.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createTenant = asyncHandler(async (req, res) => {
    const { name, plan } = req.body;

    if (!name) throw new ApiError(400, "Tenant name is required");

    const existingTenant = await Tenant.findOne({ name });
    if (existingTenant) throw new ApiError(400, "Tenant with this name already exists");

    const newTenant = await Tenant.create({
        name,
        plan: plan || "free"
    });

    //person who create a tenant  is admin 
     
    await TenantMembership.create({
        userId: req.user._id,
        tenantId:newTenant._id,
        role:"admin"

    })



    return res
        .status(201)
        .json(new ApiResponse(201, newTenant, "Tenant created successfully"));
});

// Missing tenantId extraction in deleteTenant
const deleteTenant = asyncHandler(async (req, res) => {
    const { tenantId } = req.params;  // ← Add this line
    
    if(!tenantId) throw new ApiError(400,"Tenant ID is required");
    
    const tenant = await Tenant.findById(tenantId);
    if(!tenant) throw new ApiError(404,"Tenant not found");
    
    await Tenant.findByIdAndDelete(tenantId);
    await TenantMembership.deleteMany({ tenantId });
    
    return res.status(200).json(
        new ApiResponse(200, {}, "Tenant deleted successfully")
    );
});

const getAllTenants= asyncHandler(async(req,res)=>{

    const userId=req.user._id;

    const tenantInfo = await TenantMembership.find({userId}).populate('tenantId');
    //this contain user role and tenant info 

    return res.status(200).json(
        new ApiResponse(200,tenantInfo,"Tenants fetched successfully")
    );  
    
})




const editTenantSubscription =asyncHandler(async(req,res)=>{

    const{tenantId}=req.params;

    const{ plan } = req.body;
    if(!tenantId) throw new ApiError(400,"Tenant ID is required");
    if(!plan) throw new ApiError(400,"Plan is required");
     

    if(plan!=="free" && plan!=="pro") throw new ApiError(400,"Invalid plan. Must be 'free' or 'pro'");


    const tenant = await Tenant.findById(tenantId);
    if(!tenant) throw new ApiError(404,"Tenant not found");

    tenant.plan=plan;
    await tenant.save();

    return res.status(200).json(
        new ApiResponse(200,tenant,"Tenant subscription updated successfully")
    );


    


})


 export {createTenant,deleteTenant,getAllTenants, editTenantSubscription};
