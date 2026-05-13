import { z } from "zod";
import BaseDto from "../../../common/dto/base.dto";

class SubmitResponseDto extends BaseDto {
  static override schema = z.object({
    answers: z
      .array(
        z.object({
          questionId: z.string().uuid("Invalid question id"),
          optionId: z.string().uuid("Invalid option id"),
        }),
      )
      .min(1, "At least one answer is required")
      .max(50, "Too many answers"),
  });
}

export default SubmitResponseDto;
