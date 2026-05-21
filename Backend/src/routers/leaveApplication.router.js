import { Router } from "express";
import {
  userCreateLeave,
  userUpdateLeave,
  userDeleteLeave,
  userGetAllApplication,
} from "../controller/employee.controller.js";
import {
  adminUpdateLeave,
  adminGetAllApplication,
} from "../controller/admin.controller.js";
import { verifyJWT, verifyRole } from "../middleware/auth.middleware.js";

const router = Router();

// Secure all routes with JWT verification
router.use(verifyJWT);


router.post("/", userCreateLeave);
router.get("/", userGetAllApplication);
router.put("/:id", userUpdateLeave);
router.delete("/:id", userDeleteLeave);


// Note: verifyRole is a factory function, so we call it with the required role
const requireAdmin = verifyRole("admin");

router.get("/admin/all", requireAdmin, adminGetAllApplication);
router.put("/admin/:id", requireAdmin, adminUpdateLeave);

export default router;
