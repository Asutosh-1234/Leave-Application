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

export const getAllCompanyLeavesService = async (status, date_from, date_to) => {
  const whereClause = {};

  if (status && status !== "all") {
    whereClause.status = status;
  }

  if (date_from || date_to) {
    whereClause.date_from = {};
    if (date_from) {
      whereClause.date_from.gte = new Date(date_from);
    }
    if (date_to) {
      whereClause.date_from.lte = new Date(date_to);
    }
  }

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
