import Joi from "joi";

export const createLeaveSchema = {
  body: Joi.object({
    date_from: Joi.date().iso().required().messages({
      "date.format": "Invalid date_from format",
      "any.required": "Start date is required"
    }),
    date_to: Joi.date().iso().min(Joi.ref('date_from')).required().messages({
      "date.format": "Invalid date_to format",
      "any.required": "End date is required",
      "date.min": "End date must be on or after the start date"
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
    date_from: Joi.date().iso().optional().messages({
      "date.format": "Invalid date_from format"
    }),
    date_to: Joi.date().iso().min(Joi.ref('date_from')).optional().messages({
      "date.format": "Invalid date_to format",
      "date.min": "End date must be on or after the start date"
    }),
    reason: Joi.string().optional(),
    details: Joi.string().allow(null, "").optional()
  })
  .with('date_from', 'date_to')
  .with('date_to', 'date_from')
  .min(1).messages({
    "object.min": "You must provide at least one field to update",
    "object.with": "Both start date and end date must be provided together if updating dates"
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
