import { z } from "zod";
import BaseDto from "../../../common/dto/base.dto.js";

class ForgotPasswordDto extends BaseDto {
  static schema = z.object({
    email: z
      .string()
      .email()
      .toLowerCase()
      .transform((val) => val.toLowerCase()),
  });
}

export default ForgotPasswordDto;
