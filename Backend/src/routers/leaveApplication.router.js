import { Router } from "express";
import {
  userCreateLeave,
  userUpdateLeave,
  userDeleteLeave,
  userGetAllApplication,
} from "../controller/employee.controller.js";
import {
  adminGetAllApplication,
  adminGetApplicationById,
  adminUpdateLeave,
} from "../controller/admin.controller.js";
import { verifyJWT, verifyRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createLeaveSchema, updateLeaveSchema, deleteLeaveSchema } from "../validations/leave.validation.js";
import { adminGetAllSchema, adminGetByIdSchema, adminUpdateLeaveSchema } from "../validations/admin.validation.js";

const router = Router();

// Apply auth middleware to all routes
router.use(verifyJWT);

// === User Routes ===
router.post("/", verifyRole("user"), validate(createLeaveSchema), userCreateLeave);
router.get("/", verifyRole("user"), userGetAllApplication);
router.put("/:id", verifyRole("user"), validate(updateLeaveSchema), userUpdateLeave);
router.delete("/:id", verifyRole("user"), validate(deleteLeaveSchema), userDeleteLeave);

// === Admin Routes ===
router.get("/admin/all", verifyRole("admin"), validate(adminGetAllSchema), adminGetAllApplication);
router.get("/admin/:id", verifyRole("admin"), validate(adminGetByIdSchema), adminGetApplicationById);
router.put("/admin/:id", verifyRole("admin"), validate(adminUpdateLeaveSchema), adminUpdateLeave);

export default router;
