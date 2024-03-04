import axios from "axios";

import { GetFilteredResponsesContext } from "../../middleware/validation/get-filtered-responses";
import { ResponseFiltersType } from "../../schemas/response-filters";
import { SubmissionResponse, SubmissionsQueryResponse } from "../../schemas/submissions";

export async function getFilteredResponses(
  formId: string,
  context: GetFilteredResponsesContext
): Promise<SubmissionsQueryResponse> {
  const { filters } = context;
  const { limit, offset, ...existingParamsWithoutPageination } = context.existingParams;
  const response = await axios.get(`https://api.fillout.com/v1/api/forms/${formId}/submissions`, {
    headers: {
      Authorization: `Bearer ${process.env.FILLOUT_API_KEY}`,
    },
    params: {
      ...existingParamsWithoutPageination,
    },
  });

  const unfilteredResponses = SubmissionsQueryResponse.parse(response.data);
  const filteredResponses = filterResponses(unfilteredResponses, filters);

  return {
    pageCount: limit ? Math.ceil(filteredResponses.length / limit) : 1,
    totalResponses: filteredResponses.length,
    responses: applyLimitAndOffset(filteredResponses, limit, offset),
  };
}

function filterResponses(unfilteredResponses: SubmissionsQueryResponse, filters: ResponseFiltersType) {
  const filteredResponses = unfilteredResponses.responses.filter((response) => {
    if (!filters) return true;
    for (const filter of filters) {
      const answer = response.questions.find((question) => question.id === filter.id)?.value;

      switch (filter.condition) {
        case "does_not_equal":
          return filter.value !== answer;

        case "equals":
          return filter.value === answer;

        case "greater_than":
          return answer && filter.value < answer;

        case "less_than":
          return answer && filter.value > answer;

        default:
          return false;
      }
    }
  });
  return filteredResponses;
}

function applyLimitAndOffset(responses: SubmissionResponse[], limit: number | null, offset: number | null) {
  let adjustedResponses = responses;
  if (offset) {
    adjustedResponses = adjustedResponses.slice(offset);
  }
  if (limit) {
    adjustedResponses = adjustedResponses.slice(0, limit);
  }
  return adjustedResponses;
}
