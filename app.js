import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from 'cors';


const app = express();
app.use(morgan("dev"));
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://sprightly-gelato-6bd483.netlify.app'
  ],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());





import tenantRoutes from "./routes/tenant.route.js";
import userroutes from "./routes/user.route.js";
import notesRoutes from "./routes/notes.route.js";
import tenantMembershipRoutes from "./routes/tenantMembership.route.js";

app.use("/api/v1/tenant-membership", tenantMembershipRoutes);
app.use("/api/v1/notes", notesRoutes);
app.use("/api/v1/tenants", tenantRoutes);
app.use("/api/v1/users", userroutes);

export default app;