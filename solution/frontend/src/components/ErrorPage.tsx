import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  let errorMsg = "";
  let errorCode = 404;
  if (isRouteErrorResponse(error)) {
    errorCode = error.status;
    if (error.status === 404) {
      errorMsg = "UH OH! You are lost";
    }
    if (error.status === 401) {
      errorMsg = "Unauthorized";
    }
  }

  return (
    <main>
      <div className="container">
        <div className="row">
          <div className="col-md-6 align-self-center">
            <h1>{errorCode}</h1>
            {/* <h2>UH OH! You are lost.</h2> */}
            <h2>{errorMsg}</h2>
            {errorCode === 404 && (
              <p>
                The page you are looking for does not exist. How you got here is a mystery. But you can click the button
                below to go back to the homepage.
              </p>
            )}
            {errorCode === 401 && <p>You must be logged in to see this page</p>}

            <Link to="/" className="btn btn-primary">
              Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
