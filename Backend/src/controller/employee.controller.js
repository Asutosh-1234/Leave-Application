import { ApiResponse } from "../utilities/api-response.js";
import { asyncHandler } from "../utilities/async-handler.js";
import { 
  createLeaveService, 
  updateLeaveService, 
  deleteLeaveService, 
  getAllEmployeeLeavesService 
} from "../services/employee.service.js";

const userCreateLeave = asyncHandler(async (req, res) => {
  // Input Validation is handled by Joi middleware
  const { reason, date_from, date_to, details } = req.body;
  const userID = req.user.id;
  
  const parsedDateFrom = new Date(date_from);
  const parsedDateTo = new Date(date_to);

  const newLeave = await createLeaveService(userID, parsedDateFrom, parsedDateTo, reason, details);

  return res
    .status(201)
    .json(new ApiResponse(201, newLeave, "Leave request created successfully"));
});

const userUpdateLeave = asyncHandler(async (req, res) => {
  // Input Validation is handled by Joi middleware
  const { id } = req.params;
  const { reason, date_from, date_to, details } = req.body;
  const userID = req.user.id;

  let parsedDateFrom = null;
  let parsedDateTo = null;
  if (date_from) parsedDateFrom = new Date(date_from);
  if (date_to) parsedDateTo = new Date(date_to);

  const updatedLeave = await updateLeaveService(id, userID, parsedDateFrom, parsedDateTo, reason, details);

  return res
    .status(200)
    .json(new ApiResponse(200, updatedLeave, "Leave request updated successfully"));
});

const userDeleteLeave = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userID = req.user.id;

  await deleteLeaveService(id, userID);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Leave request deleted successfully"));
});

const userGetAllApplication = asyncHandler(async (req, res) => {
  const userID = req.user.id;

  const leaves = await getAllEmployeeLeavesService(userID);

  return res
    .status(200)
    .json(new ApiResponse(200, leaves, "Leave applications retrieved successfully"));
});

export { 
  userCreateLeave, 
  userUpdateLeave, 
  userDeleteLeave, 
  userGetAllApplication
};
