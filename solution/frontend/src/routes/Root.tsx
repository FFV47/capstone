import { QueryClient, useQuery } from "@tanstack/react-query";
import { Suspense, createContext, useContext } from "react";
import { Outlet, useLoaderData } from "react-router-dom";

import axios from "axios";
import { Toast, ToastContainer } from "react-bootstrap";
import { z } from "zod";
import NavBar from "../components/NavBar";
import useStateReducer, { StateReducerDispatch } from "../hooks/useStateReducer";
import { LoaderData } from "../utils/utils";

// *** Data fetch ***
const rolesSchema = z.array(z.string());
export type JobRoles = z.infer<typeof rolesSchema>;

const rolesQuery = {
  queryKey: ["roles"],
  queryFn: async () => {
    const { data } = await axios.get("/solution-api/roles");
    return rolesSchema.parse(data);
  },
};

// *** Component ***
export type RootLoaderData = LoaderData<typeof loader>;

// loader is a normal function when no parameters are used, or must return
// another async function when called with parameters from the router
export function loader(queryClient: QueryClient) {
  return async () => {
    const data = queryClient.ensureQueryData(rolesQuery);

    if (!data) throw new Response("Worker roles not found", { status: 404 });
    return data;
  };
}

type RootState = {
  showToast: boolean;
  toastHeader: string;
  toastBody: string;
};

type Context = {
  dispatch: StateReducerDispatch<RootState>;
};

const RootContext = createContext<Context | null>(null);

export function useRootContext() {
  const context = useContext(RootContext);

  if (!context) {
    throw new Error("useRootContext must be used within a RootProvider");
  }
  return context;
}

export default function Root() {
  const initialData = useLoaderData() as RootLoaderData;
  useQuery({ ...rolesQuery, initialData });

  const [state, dispatch] = useStateReducer({
    showToast: false,
    toastHeader: "",
    toastBody: "",
  });

  const fallback = (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "90vh" }}>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <>
      <ToastContainer className="success-toast">
        <Toast
          bg="success"
          show={state.showToast}
          onClose={() => dispatch({ showToast: false })}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">{state.toastHeader}</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{state.toastBody}</Toast.Body>
        </Toast>
      </ToastContainer>

      <NavBar />
      <Suspense fallback={fallback}>
        <RootContext.Provider value={{ dispatch }}>
          <Outlet />
        </RootContext.Provider>
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
