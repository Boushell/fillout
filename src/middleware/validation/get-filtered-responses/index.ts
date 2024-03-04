import { HttpStatusCode } from "axios";
import { NextFunction, Request, Response } from "express";

import { ExistingParamsSchema, ExistingSubmissionQueryParams } from "../../../schemas/existing-fillout-params";
import { ResponseArraySchema, ResponseFiltersType } from "../../../schemas/response-filters";

export type GetFilteredResponsesContext = {
  filters: ResponseFiltersType;
  existingParams: ExistingSubmissionQueryParams;
};

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

declare global {
  namespace Express {
    interface Request {
      context: GetFilteredResponsesContext;
    }
  }
}
