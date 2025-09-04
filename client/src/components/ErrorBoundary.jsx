import { useMemo } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router";

export default function ErrorBoundary() {
  const error = useRouteError();
  if (import.meta.env.DEV) {
    console.error(error);
  }
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error?.response?.data?.message || error.message;
    stack = error.stack;
    console.log(stack);
  }
  const msgs = useMemo(() => ["jwt expired", "jwt malformed"], []);

  const redirect = () => {
    window.location.reload();
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen gap-2">
      {error?.status === 404 ? (
        <img src="/404.svg" alt="404" className="w-[30%] h-[300px]" />
      ) : (
        <img src="/Error.svg" alt="Error" className="w-[30%] h-[300px]" />
      )}
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-red-600 font-bold text-xl">{message}</p>
      <p className="text-gray-600">
        {msgs.includes(details) ? "Session expired" : details}
      </p>
      <button
        onClick={redirect}
        type="button"
        className="my-4 btn bg-blue-500 hover:bg-blue-700 text-white"
      >
        {msgs.includes(details) ? "Refresh" : "Go back"}
      </button>
    </div>
  );
}
