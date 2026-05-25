import prisma from "../utilities/prisma-client.js";
import { ApiError } from "../utilities/api-error.js";

export const createLeaveService = async (userID, parsedDateFrom, parsedDateTo, reason, details) => {
  const newLeave = await prisma.leaveRequest.create({
    data: {
      user_id: userID,
      date_from: parsedDateFrom,
      date_to: parsedDateTo,
      reason,
      details: details || null,
      status: "pending",
    },
  });

  return newLeave;
};

export const updateLeaveService = async (id, userID, parsedDateFrom, parsedDateTo, reason, details) => {
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
  if (parsedDateFrom) updateData.date_from = parsedDateFrom;
  if (parsedDateTo) updateData.date_to = parsedDateTo;

  const updatedLeave = await prisma.leaveRequest.update({
    where: { id },
    data: updateData,
  });

  return updatedLeave;
};

export const deleteLeaveService = async (id, userID) => {
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
  return true;
};

export const getAllEmployeeLeavesService = async (userID) => {
  const leaves = await prisma.leaveRequest.findMany({
    where: { user_id: userID },
    orderBy: { created_at: 'desc' }
  });

  return leaves;
};
