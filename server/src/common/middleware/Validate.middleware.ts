import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/api-error.js";
import BaseDto from "../dtos/base-dto.js";

type DtoClass = typeof BaseDto;

const validate = (DtoClass: DtoClass) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { errors, value } = DtoClass.validate(req.body);
    if (errors) {
      throw ApiError.badRequest(errors.join("; "));
    }
    req.body = value;
    next();
  };
};

export default validate;
