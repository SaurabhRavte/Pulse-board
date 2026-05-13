import { z } from "zod";
import BaseDto from "../../../common/dto/base.dto.js";

class ClerkSyncDto extends BaseDto {
  static override schema = z.object({
    clerkId: z.string().min(1),
    email: z
      .string()
      .email()
      .transform((v) => v.toLowerCase()),
    name: z.string().trim().min(1).max(120),
  });
}

export default ClerkSyncDto;
