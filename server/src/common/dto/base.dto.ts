import { z, ZodObject, ZodRawShape, ZodTypeAny } from "zod";

class BaseDto {
  static schema: ZodTypeAny = z.object({});

  static validate<T extends ZodRawShape>(
    this: { schema: ZodObject<T> },
    data: unknown,
  ): { errors: string[] | null; value: z.infer<ZodObject<T>> | null } {
    const result = this.schema.safeParse(data);

    if (!result.success) {
      const errors = result.error.errors.map((e) => e.message);
      return { errors, value: null };
    }

    return { errors: null, value: result.data };
  }
}

export default BaseDto;
