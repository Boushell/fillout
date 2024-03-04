import { z } from "zod";

export const ResponsesSchema = z.object({});

export const ResponseFilterSchema = z.object({
  id: z.string(),
  condition: z.enum(["equals", "does_not_equal", "greater_than", "less_than"]),
  value: z.string().or(z.number()),
});

export const ResponseArraySchema = z.array(ResponseFilterSchema);

export type ResponseFilter = typeof ResponseFilterSchema._type;

export type ResponseFiltersType = typeof ResponseArraySchema._type | null;
