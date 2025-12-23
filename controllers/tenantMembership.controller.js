import TenantMembership from "../models/tenantMembership.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Tenant from "../models/tenant.model.js";
import User from "../models/user.model.js";

const getAllTenantsMembership = asyncHandler(async (req, res) => {
  const { tenantId } = req.params;

  if (!tenantId) throw ApiError(400, "Tenant ID is required");

  const memberships = await TenantMembership.find({ tenantId })
    .populate("userId", "username email");

  return res.status(200).json(
    new ApiResponse(200, memberships, "Tenant memberships fetched successfully")
  );
});

const addMemberToTenant = asyncHandler(async (req, res) => {
  console.log("Request Body:", req.body);
  console.log("Request Params:", req.params);
  const { userId, role } = req.body;
  const email=userId;
  const { tenantId } = req.params;

  if (!tenantId) throw new ApiError(400, "Tenant ID is required");
  if (!userId) throw new ApiError(400, "User ID is required");
  if (!role) throw new ApiError(400, "Role is required");

  // Check if tenant exists
  const tenant = await Tenant.findById(tenantId);
  if (!tenant) throw new ApiError(404, "Tenant not found");

  // Check if user exists
  const user = await User.findOne({email});
  if (!user) throw new ApiError(404, "User not found");

  const existingMembership = await TenantMembership.findOne({ userId: user._id, tenantId });
  if (existingMembership) throw new ApiError(409, "User is already a member of this tenant");

  const membership = await TenantMembership.create({
    userId: user._id,
    tenantId,
    role
  });

  return res.status(201).json(
    new ApiResponse(201, membership, "Member added successfully")
  );
});


const changeMemberRole = asyncHandler(async (req, res) => {
  const { tenantId } = req.params;
  const { userId, role } = req.body;

  if (!tenantId) throw new ApiError(400, "Tenant ID is required");
  if (!userId) throw new ApiError(400, "User ID is required");
  if (!role) throw new ApiError(400, "Role is required");

  if (!['admin', 'member'].includes(role)) {
    throw new ApiError(400, "Invalid role. Must be 'admin' or 'member'");
  }

  const updatedMembership = await TenantMembership.findOneAndUpdate(
    { userId, tenantId },
    { role },
    { new: true, runValidators: true }
  );

  if (!updatedMembership) throw new ApiError(404, "Membership not found");

  return res.status(200).json(
    new ApiResponse(200, updatedMembership, "Member role updated successfully")
  );
});


const removeMembership = asyncHandler(async (req, res) => {
  const { tenantId } = req.params;
  const { userId } = req.body;

  if (!tenantId) throw new ApiError(400, "Tenant ID is required");
  if (!userId) throw new ApiError(400, "User ID is required");

  const membership = await TenantMembership.findOneAndDelete({ userId, tenantId });

  if (!membership) throw new ApiError(404, "Membership not found");

  return res.status(200).json(
    new ApiResponse(200, {}, "Member removed successfully")
  );
});

export { getAllTenantsMembership, addMemberToTenant, changeMemberRole, removeMembership };