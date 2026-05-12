import { z } from "zod";
import BaseDto from "../../../common/dto/base.dto.js";

class ResetPasswordDto extends BaseDto {
  static schema = z.object({
    password: z
      .string()
      .min(8)
      .regex(
        /(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter and one digit",
      ),
  });
}

export default ResetPasswordDto;
