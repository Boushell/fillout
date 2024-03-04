import { z } from "zod";

export const ExistingParamsSchema = z.object({
  limit: z
    .string()
    .or(z.undefined())
    .or(z.null())
    .transform((val) => (val ? parseInt(val) : null)),
  afterDate: z.string().or(z.undefined()).or(z.null()),
  beforeDate: z.string().or(z.undefined()).or(z.null()),
  offset: z
    .string()
    .or(z.undefined())
    .or(z.null())
    .transform((val) => (val ? parseInt(val) : null)),
  status: z.string().or(z.undefined()).or(z.null()),
  includeEditLink: z
    .string()
    .or(z.undefined())
    .or(z.null())
    .transform((val) => val === "true"),
  sort: z.enum(["asc", "desc"]).or(z.undefined()).or(z.null()),
});

export type ExistingSubmissionQueryParams = typeof ExistingParamsSchema._type;
