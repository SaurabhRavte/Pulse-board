import { z } from "zod";
import BaseDto from "../../../common/dto/base.dto.js";

class LoginDto extends BaseDto {
  static schema = z.object({
    email: z
      .string()
      .email()
      .transform((val) => val.toLowerCase()),
    password: z.string().min(1),
  });
}

export default LoginDto;
