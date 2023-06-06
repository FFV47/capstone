import { QueryClient } from "@tanstack/react-query";
import { lazy } from "react";

// This func replaces the one in the route, to be code-splitted
export const loader = (queryClient: QueryClient) => async () => {
  // This loader func is returning the route loader
  const { loader } = await import("../features/FindWorkers/FindWorkers");
  // Get the route loader data, to make this func the loader
  return await loader(queryClient)();
};

const FindWorkers = lazy(() => import("../features/FindWorkers/FindWorkers"));
export default FindWorkers;
