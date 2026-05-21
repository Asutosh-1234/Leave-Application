import prisma from "../utilities/prisma-client.js";
import { ApiResponse } from "../utilities/api-response.js";
import { ApiError } from "../utilities/api-error.js";
import { asyncHandler } from "../utilities/async-handler.js";

const userCreateLeave = asyncHandler(async (req, res) => {
  const { reason, date, details } = req.body;

  console.log(reason, date);
  

  if (!date || !reason) {
    throw new ApiError(400, "Date and reason are required");
  }
  const userID = req.user.id;

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    throw new ApiError(400, "Invalid date format");
  }

  const newLeave = await prisma.leaveRequest.create({
    data: {
      user_id: userID,
      date: parsedDate,
      reason,
      details: details || null,
      status: "pending",
    },
  });

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

  const existingLeave = await prisma.leaveRequest.findUnique({ where: { id } });

  if (!existingLeave) {
    throw new ApiError(404, "Leave request not found");
  }

  if (existingLeave.user_id !== userID) {
    throw new ApiError(403, "Not authorized to update this leave request");
  }

  if (existingLeave.status !== "pending") {
    throw new ApiError(400, "Cannot update a leave request that is already processed");
  }

  const updateData = {};
  if (reason !== undefined) updateData.reason = reason;
  if (details !== undefined) updateData.details = details;

  if (date) {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new ApiError(400, "Invalid date format");
    }
    updateData.date = parsedDate;
  }

  const updatedLeave = await prisma.leaveRequest.update({
    where: { id },
    data: updateData,
  });

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

  const existingLeave = await prisma.leaveRequest.findUnique({ where: { id } });

  if (!existingLeave) {
    throw new ApiError(404, "Leave request not found");
  }

  if (existingLeave.user_id !== userID) {
    throw new ApiError(403, "Not authorized to delete this leave request");
  }

  if (existingLeave.status !== "pending") {
    throw new ApiError(400, "Cannot delete a leave request that is already processed");
  }

  await prisma.leaveRequest.delete({ where: { id } });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Leave request deleted successfully"));
});

const userGetAllApplication = asyncHandler(async (req, res) => {
  const userID = req.user.id;

  const leaves = await prisma.leaveRequest.findMany({
    where: { user_id: userID },
    orderBy: { created_at: 'desc' }
  });

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
