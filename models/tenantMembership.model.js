import mongoose from "mongoose";

const tenantMembershipSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
      required: true,
    },
  },
  { timestamps: true }
);


// only one tenant membership per user per tenant
tenantMembershipSchema.index({ userId: 1, tenantId: 1 }, { unique: true });

const TenantMembership = mongoose.model("TenantMembership", tenantMembershipSchema);

export default TenantMembership;
