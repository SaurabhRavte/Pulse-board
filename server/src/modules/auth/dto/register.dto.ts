import { z } from "zod";
import BaseDto from "../../../common/dto/base.dto.js";

class RegisterDto extends BaseDto {
  static schema = z.object({
    name: z.string().trim().min(2).max(50),
    email: z
      .string()
      .email()
      .transform((val) => val.toLowerCase()),
    password: z
      .string()
      .min(8)
      .regex(
        /(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter and one digit",
      ),
    role: z.enum(["customer", "seller"]).default("customer"),
  });
}

export default RegisterDto;
