import { QueryClient, useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { Outlet, useLoaderData } from "react-router-dom";

import NavBar from "../components/NavBar";
import rolesQuery from "../queries/rolesQuery";

export type RootLoaderData = Awaited<ReturnType<ReturnType<typeof loader>>>;

// loader is a normal function when no parameters are used, or must return another async function
// when called with parameters from the router
export function loader(queryClient: QueryClient) {
  return async () => {
    const data = queryClient.ensureQueryData(rolesQuery);

    if (!data) throw new Response("Worker roles not found", { status: 404 });
    return data;
  };
}

export default function Root() {
  const initialData = useLoaderData() as RootLoaderData;
  const { data: roles, isError } = useQuery({ ...rolesQuery, initialData });

  if (isError) {
    throw new Error("Worker roles not found");
  }

  const fallback = (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "90vh" }}>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <>
      <NavBar />
      <Suspense fallback={fallback}>
        <Outlet context={roles} />
      </Suspense>
      <footer className="app-footer m-0 p-2">
        <p className="text-center mb-0 small">&#169; 2022 Solution Inc. All Rights Reserved</p>
        {/* <small>Icons attributions</small> */}
        <div>
          <small className="d-inline-block text-muted me-3">
            <a
              href="https://www.flaticon.com/free-icons/contractor"
              title="contractor icons"
              className="small-links"
            >
              Contractor icons created by Freepik - Flaticon
            </a>
          </small>
          <small className="d-inline-block text-muted me-3">
            <a
              href="https://www.flaticon.com/free-icons/tool-box"
              title="tool box icons"
              className="small-links"
            >
              Tool box icons created by photo3idea_studio - Flaticon
            </a>
          </small>
        </div>
      </footer>
    </>
  );
}
