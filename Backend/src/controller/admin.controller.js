import { ApiResponse } from "../utilities/api-response.js";
import { ApiError } from "../utilities/api-error.js";
import { asyncHandler } from "../utilities/async-handler.js";
import { 
  updateLeaveStatusService, 
  getAllCompanyLeavesService, 
  getLeaveApplicationByIdService 
} from "../services/admin.service.js";

const adminUpdateLeave = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, remark } = req.body;

  if (!id) {
    throw new ApiError(400, "Leave request ID is required in URL parameters");
  }

  if (!status || !["pending", "approved", "canceled"].includes(status)) {
    throw new ApiError(400, "Valid status (pending, approved, canceled) is required");
  }

  const updatedLeave = await updateLeaveStatusService(id, status, remark);

  return res
    .status(200)
    .json(new ApiResponse(200, updatedLeave, `Leave request marked as ${status}`));
});

const adminGetAllApplication = asyncHandler(async (req, res) => {
  const { status } = req.query; 
  
  const leaves = await getAllCompanyLeavesService(status);

  return res
    .status(200)
    .json(new ApiResponse(200, leaves, "All leave applications retrieved successfully"));
});

const adminGetApplicationById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Leave request ID is required in URL parameters");
  }

  const application = await getLeaveApplicationByIdService(id);

  return res
    .status(200)
    .json(new ApiResponse(200, application, `leave application as per the ID`));
});

export { adminUpdateLeave, adminGetAllApplication, adminGetApplicationById };
