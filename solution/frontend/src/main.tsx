// add the beginning of your app entry
import "vite/modulepreload-polyfill";

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Routes
import Root, { loader as rootLoader } from "./routes/root";
import Login from "./routes/login";
import Register from "./routes/register";
import Home from "./routes/home";
import FindWorkers, { loader as findWorkersLoader } from "./routes/find-workers/find-workers";
import WorkerPage, { loader as workerPageLoader } from "./routes/worker";
import SetupAccount, { loader as setupAccountLoader } from "./routes/setup-account/setup-account";
import AccountType from "./routes/setup-account/AccountType";
import PersonalInfo from "./routes/setup-account/personal";
import CompanyInfo from "./routes/setup-account/business/business";
import CompanyRepInfo from "./routes/setup-account/business/business-rep";
import UserAccount from "./routes/user";
import FindJobs, { loader as findJobsLoader } from "./routes/find-jobs/find-jobs";
import JobFeed from "./routes/find-jobs/JobFeed";
import SelectedJobCard from "./routes/find-jobs/SelectedJobCard";
import JobFavorites from "./routes/find-jobs/JobFavorites";
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
    id: "root",
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
      },
      {
        path: "worker/:id",
        element: <WorkerPage />,
        loader: workerPageLoader(queryClient),
        action: undefined,
      },
      {
        path: "setup-account",
        element: <SetupAccount />,
        loader: setupAccountLoader,
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
            element: <CompanyInfo />,
          },
          {
            path: "business-rep",
            element: <CompanyRepInfo />,
          },
        ],
      },
      {
        path: "user",
        element: <UserAccount />,
        loader: undefined,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
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
