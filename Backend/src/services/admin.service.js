import prisma from "../utilities/prisma-client.js";
import { ApiError } from "../utilities/api-error.js";

export const updateLeaveStatusService = async (id, status, remark) => {
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

  return updatedLeave;
};

export const getAllCompanyLeavesService = async (status) => {
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

  return leaves;
};

export const getLeaveApplicationByIdService = async (id) => {
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

  return application;
};
