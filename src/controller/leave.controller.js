import prisma from "../utilities/prisma-client.js";
import { ApiResponse } from "../utilities/api-response.js";
import { ApiError } from "../utilities/api-error.js";
import { asyncHandler } from "../utilities/async-handler.js";

const applyLeave = asyncHandler(async (req, res)=>{
  const {reason, details} = req.body;

  if(!reason || !details){
    throw new ApiError(400, "reason or details is missing");
  }
  const userID = req.user.userId
})
