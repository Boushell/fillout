import { z } from "zod";

const QuestionSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(), // Should be enum with specific types, but for the purpose of this excersize it doesn't matter.
  value: z.string().or(z.null()).or(z.number()).or(z.undefined()),
});

const CalculationSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(), // Should also be a more specific enum
  value: z.string(),
});

const UrlParameterSchema = z.object({
  id: z.string(),
  name: z.string(),
  value: z.string(),
});

const QuizSchema = z.object({
  score: z.number().or(z.null()).or(z.undefined()),
  maxScore: z.number().or(z.null()).or(z.undefined()),
});

const ResponseSchema = z.object({
  questions: z.array(QuestionSchema),
  calculations: z.array(CalculationSchema),
  urlParameters: z.array(UrlParameterSchema),
  quiz: z.optional(QuizSchema),
  submissionId: z.string(),
  submissionTime: z.string(),
});

export const SubmissionsQueryResponse = z.object({
  responses: z.array(ResponseSchema),
  totalResponses: z.number(),
  pageCount: z.number(),
});

export type SubmissionResponse = typeof ResponseSchema._type;
export type SubmissionsQueryResponse = typeof SubmissionsQueryResponse._type;
