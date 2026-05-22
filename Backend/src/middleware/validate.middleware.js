import Joi from "joi";
import { ApiError } from "../utilities/api-error.js";

/**
 * Global validation middleware generator.
 * @param {Object} schema - Object containing Joi schemas for body, params, and/or query
 * @example validate({ body: Joi.object({...}), params: Joi.object({...}) })
 */

export const validate = (schema) => (req, res, next) => {
  const validSchema = Joi.object(schema);
  
  // Create an object with the current request data that matches the schema structure
  const objectToValidate = {};
  if (schema.body) objectToValidate.body = req.body;
  if (schema.params) objectToValidate.params = req.params;
  if (schema.query) objectToValidate.query = req.query;

  const { value, error } = validSchema.validate(objectToValidate, { abortEarly: false, stripUnknown: true });

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(", ");
    return next(new ApiError(400, errorMessage));
  }

  // Mutate req to replace with validated/stripped values
  if (schema.body) req.body = value.body;
  if (schema.params) req.params = value.params;
  if (schema.query) req.query = value.query;

  return next();
};
