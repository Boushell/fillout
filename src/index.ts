import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";

import { validateFilteredResponsesQuery } from "./middleware/validation/get-filtered-responses";
import { getFilteredResponses } from "./services/filtered-responses";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(validateFilteredResponsesQuery).get("/:formId/filteredResponses", async (req: Request, res: Response) => {
  const filteredResponses = await getFilteredResponses(req.params.formId, req.context);
  res.send(filteredResponses);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
