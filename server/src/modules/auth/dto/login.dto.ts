import { z } from "zod";
import BaseDto from "../../../common/dto/base.dto";

class LoginDto extends BaseDto {
  static override schema = z.object({
    email: z
      .string()
      .email("Invalid email address")
      .transform((v) => v.toLowerCase()),
    password: z.string().min(1, "Password is required"),
  });
}

export default LoginDto;
