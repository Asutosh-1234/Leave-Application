import { ApiResponse } from "../utilities/api-response.js";
import { ApiError } from "../utilities/api-error.js";
import { asyncHandler } from "../utilities/async-handler.js";
import { 
  createLeaveService, 
  updateLeaveService, 
  deleteLeaveService, 
  getAllEmployeeLeavesService 
} from "../services/employee.service.js";

const userCreateLeave = asyncHandler(async (req, res) => {
  const { reason, date, details } = req.body;

  if (!date || !reason) {
    throw new ApiError(400, "Date and reason are required");
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    throw new ApiError(400, "Invalid date format");
  }

  const userID = req.user.id;

  const newLeave = await createLeaveService(userID, parsedDate, reason, details);

  return res
    .status(201)
    .json(new ApiResponse(201, newLeave, "Leave request created successfully"));
});

const userUpdateLeave = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason, date, details } = req.body;
  const userID = req.user.id;

  if (!id) {
    throw new ApiError(400, "Leave request ID is required in URL parameters");
  }

  let parsedDate = null;
  if (date) {
    parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new ApiError(400, "Invalid date format");
    }
  }

  const updatedLeave = await updateLeaveService(id, userID, parsedDate, reason, details);

  return res
    .status(200)
    .json(new ApiResponse(200, updatedLeave, "Leave request updated successfully"));
});

const userDeleteLeave = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userID = req.user.id;

  if (!id) {
    throw new ApiError(400, "Leave request ID is required in URL parameters");
  }

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
