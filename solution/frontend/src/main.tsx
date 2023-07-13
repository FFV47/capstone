// add the beginning of your app entry
import "vite/modulepreload-polyfill";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Routes
import FindJobs, { loader as findJobsLoader } from "./routes/find-jobs/FindJobs";
import JobFavorites from "./routes/find-jobs/JobFavorites";
import JobFeed from "./routes/find-jobs/feed/JobFeed";
import SelectedJobCard from "./routes/find-jobs/feed/SelectedJobCard";
import FindWorkers, { loader as findWorkersLoader } from "./routes/find-workers/FindWorkers";
import Home from "./routes/Home";
import Root, { loader as rootLoader } from "./routes/Root";
import AccountType from "./routes/setup-account/AccountType";
import BusinessForm from "./routes/setup-account/business/BusinessForm";
import BusinessRepForm from "./routes/setup-account/business-rep/BusinessRepForm";
import PersonalInfo from "./routes/setup-account/personal/Personal";
import SetupAccount, { loader as setupAccountLoader } from "./routes/setup-account/SetupAccount";
import UserAccount from "./routes/UserAccount";
import WorkerPage, { loader as workerPageLoader } from "./routes/WorkerPage";
// import ErrorPage from "./components/ErrorPage";

// Code-splitted Routes
// import FindWorkers, { loader as findWorkersLoader } from "./routesCodeSplit/FindWorkers";
// import SearchWorkers, { loader as searchWorkerLoader } from "./routesCodeSplit/SearchWorkers";
// import WorkerPage, { loader as workerPageLoader } from "./routesCodeSplit/WorkerPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: rootLoader(queryClient),
    // errorElement: <ErrorPage />,
    id: "root", // needed for useRouteLoaderData
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "find-jobs",
        element: <FindJobs />,
        loader: findJobsLoader(queryClient),
        id: "find-jobs",
        children: [
          {
            path: "feed?",
            element: <JobFeed />,
            children: [
              {
                path: ":id",
                element: <SelectedJobCard />,
              },
            ],
          },
          {
            path: "favorites",
            element: <JobFavorites />,
          },
        ],
      },
      {
        path: "find-workers",
        element: <FindWorkers />,
        loader: findWorkersLoader(queryClient),
        id: "find-workers",
      },
      {
        path: "worker/:id",
        element: <WorkerPage />,
        loader: workerPageLoader(queryClient),
        id: "worker-page",
      },
      {
        path: "setup-account",
        element: <SetupAccount />,
        loader: setupAccountLoader,
        id: "setup-account",
        children: [
          {
            index: true,
            element: <AccountType />,
          },
          {
            path: "personal",
            element: <PersonalInfo />,
          },
          {
            path: "business",
            element: <BusinessForm />,
          },
          {
            path: "business-rep",
            element: <BusinessRepForm />,
          },
        ],
      },
      {
        path: "user",
        element: <UserAccount />,
      },
    ],
  },
]);

let container: HTMLElement | null = null;

// Bootstrap Form Validation also add "DOMContentLoaded" event, so conditionally render React to
// avoid calling "createRoot" twice
document.addEventListener("DOMContentLoaded", () => {
  if (!container) {
    container = document.getElementById("root") as HTMLElement;
    const root = ReactDOM.createRoot(container);

    root.render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </React.StrictMode>
    );
  }
});
