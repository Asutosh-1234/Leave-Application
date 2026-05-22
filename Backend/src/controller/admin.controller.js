import prisma from "../utilities/prisma-client.js";
import { ApiResponse } from "../utilities/api-response.js";
import { ApiError } from "../utilities/api-error.js";
import { asyncHandler } from "../utilities/async-handler.js";

const adminUpdateLeave = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, remark } = req.body;

  if (!id) {
    throw new ApiError(400, "Leave request ID is required in URL parameters");
  }

  if (!status || !["pending", "approved", "canceled"].includes(status)) {
    throw new ApiError(400, "Valid status (pending, approved, canceled) is required");
  }

  const existingLeave = await prisma.leaveRequest.findUnique({ where: { id } });

  if (!existingLeave) {
    throw new ApiError(404, "Leave request not found");
  }

  const updateData = { status };
  if (remark !== undefined) updateData.remark = remark;

  const updatedLeave = await prisma.leaveRequest.update({
    where: { id },
    data: updateData,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedLeave, `Leave request marked as ${status}`));
});

const adminGetAllApplication = asyncHandler(async (req, res) => {
  const { status } = req.query; 
  
  const whereClause = status ? { status } : {};

  const leaves = await prisma.leaveRequest.findMany({
    orderBy: { created_at: 'desc' },
    where: whereClause,
    include: {
      user: {
        select: {
          name: true,
          email: true,
        }
      }
    }
  });

  return res
    .status(200)
    .json(new ApiResponse(200, leaves, "All leave applications retrieved successfully"));
});

const adminGetApplicationById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Leave request ID is required in URL parameters");
  }

  const application = await prisma.leaveRequest.findUnique({ 
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        }
      }
    }
  });

  if (!application) {
    throw new ApiError(404, "Leave request not found");
  }


  return res
    .status(200)
    .json(new ApiResponse(200, application, `leave application as per the ID`));
});

export { adminUpdateLeave, adminGetAllApplication, adminGetApplicationById};
