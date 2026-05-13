import { z } from "zod";
import BaseDto from "../../../common/dto/base.dto";

const QuestionSchema = z.object({
  prompt: z.string().trim().min(1, "Question prompt is required").max(500),
  isMandatory: z.boolean().default(true),
  options: z
    .array(z.string().trim().min(1, "Option label is required").max(200))
    .min(2, "Each question needs at least 2 options")
    .max(10, "Too many options on a single question"),
});

class CreatePollDto extends BaseDto {
  static override schema = z.object({
    title: z.string().trim().min(2, "Title is too short").max(200),
    description: z.string().trim().max(2000).optional().nullable(),
    responseMode: z.enum(["anonymous", "authenticated"]).default("anonymous"),
    // ISO datetime, must be in the future (the service double-checks).
    expiresAt: z.string().datetime().optional().nullable(),
    questions: z
      .array(QuestionSchema)
      .min(1, "Poll must have at least one question")
      .max(50, "Too many questions on a single poll"),
  });
}

export default CreatePollDto;
