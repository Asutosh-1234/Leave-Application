import Joi from "joi";

export const adminUpdateLeaveSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required().messages({
      "string.guid": "Leave request ID must be a valid UUID",
      "any.required": "Leave request ID is required in URL parameters"
    })
  }),
  body: Joi.object({
    status: Joi.string().valid("pending", "approved", "canceled").required().messages({
      "any.only": "Valid status (pending, approved, canceled) is required",
      "any.required": "Status is required"
    }),
    remark: Joi.string().allow(null, "").optional()
  })
};

export const adminGetAllSchema = {
  query: Joi.object({
    status: Joi.string().valid("pending", "approved", "canceled").optional().messages({
      "any.only": "Valid query status (pending, approved, canceled) is allowed"
    })
  })
};

export const adminGetByIdSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required().messages({
      "string.guid": "Leave request ID must be a valid UUID",
      "any.required": "Leave request ID is required in URL parameters"
    })
  })
};
