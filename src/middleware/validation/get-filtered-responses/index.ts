import { HttpStatusCode } from "axios";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { ResponseArraySchema, ResponseFiltersType } from "../../../schemas/response-filters";

const ExistingParamsSchema = z.object({
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

export type GetFilteredResponsesContext = {
  filters: ResponseFiltersType;
  existingParams: ExistingSubmissionQueryParams;
};

declare global {
  namespace Express {
    interface Request {
      context: GetFilteredResponsesContext;
    }
  }
}

export async function validateFilteredResponsesQuery(req: Request, res: Response, next: NextFunction) {
  const { filters: filtersParam, ...existingParams } = req.query;

  try {
    const filters = filtersParam ? ResponseArraySchema.parse(JSON.parse(filtersParam.toString())) : null;
    req.context = {
      filters: filters,
      existingParams: ExistingParamsSchema.parse(existingParams),
    };
    next();
  } catch (error) {
    return res.status(HttpStatusCode.BadRequest).send({ success: false });
  }
}
