import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/api-error.js";
import type BaseDto from "../dto/base.dto.js";

type DtoClass = typeof BaseDto;

const validate = (DtoClass: DtoClass) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const { errors, value } = DtoClass.validate(req.body);
    if (errors) {
      return next(ApiError.badRequest(errors.join("; ")));
    }
    req.body = value;
    next();
  };
};

export default validate;
