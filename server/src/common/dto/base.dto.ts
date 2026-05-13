import { z, type ZodTypeAny } from "zod";

abstract class BaseDto {
  static schema: ZodTypeAny = z.object({});

  static validate<S extends ZodTypeAny>(
    this: { schema: S },
    data: unknown,
  ): { errors: string[] | null; value: z.infer<S> | null } {
    const result = this.schema.safeParse(data);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => {
        const path = issue.path.join(".");
        return path ? `${path}: ${issue.message}` : issue.message;
      });
      return { errors, value: null };
    }

    return { errors: null, value: result.data as z.infer<S> };
  }
}

export default BaseDto;
