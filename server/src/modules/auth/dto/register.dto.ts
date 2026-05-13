import { z } from "zod";
import BaseDto from "../../../common/dto/base.dto";

class RegisterDto extends BaseDto {
  static override schema = z.object({
    name: z.string().trim().min(2, "Name is too short").max(120),
    email: z
      .string()
      .email("Invalid email address")
      .transform((v) => v.toLowerCase()),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter and one digit",
      ),
  });
}

export default RegisterDto;
