import Joi from "joi";

export const createLeaveSchema = {
  body: Joi.object({
    date: Joi.date().iso().required().messages({
      "date.format": "Invalid date format",
      "any.required": "Date is required"
    }),
    reason: Joi.string().required().messages({
      "string.empty": "Reason is required"
    }),
    details: Joi.string().allow(null, "").optional()
  })
};

export const updateLeaveSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required().messages({
      "string.guid": "Leave request ID must be a valid UUID",
      "any.required": "Leave request ID is required in URL parameters"
    })
  }),
  body: Joi.object({
    date: Joi.date().iso().optional().messages({
      "date.format": "Invalid date format"
    }),
    reason: Joi.string().optional(),
    details: Joi.string().allow(null, "").optional()
  }).min(1).messages({
    "object.min": "You must provide at least one field to update"
  })
};

export const deleteLeaveSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required().messages({
      "string.guid": "Leave request ID must be a valid UUID",
      "any.required": "Leave request ID is required in URL parameters"
    })
  })
};
