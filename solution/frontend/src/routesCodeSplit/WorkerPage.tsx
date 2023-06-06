import { QueryClient } from "@tanstack/react-query";
import { lazy } from "react";
import { LoaderFunctionArgs } from "react-router-dom";

// This func replaces the one in the route, to be code-splitted
export const loader = (queryClient: QueryClient) => async (args: LoaderFunctionArgs) => {
  // This loader func is returning the route loader
  const { loader } = await import("../routes/worker");
  // Get the route loader data, to make this func the loader
  return await loader(queryClient)(args);
};

const WorkerPage = lazy(() => import("../routes/worker"));
export default WorkerPage;
