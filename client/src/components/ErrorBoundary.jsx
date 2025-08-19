import { refreshAccessToken } from "@/api/auth";
import { useAuth } from "@/store";
import { useEffect, useMemo } from "react";
import { isRouteErrorResponse, useRouteError, useNavigate } from "react-router";

export default function ErrorBoundary() {
  const { setIsAuthenticating, setAccessToken } = useAuth();
  const error = useRouteError();
  const navigate = useNavigate();
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

//   useEffect(() => {
//     if (error?.status === 401) {
//       setIsAuthenticating(true);
//       async function refresh() {
//         try {
//           const res = await refreshAccessToken();
//           if (res.status === 200) {
//             const newAccessToken = res.data?.data?.accessToken;
//             setAccessToken(newAccessToken);
//             setIsAuthenticating(false);
//           }
//         } catch (error) {
//           console.error(error);
//           setAccessToken(null);
//         } finally {
//           setIsAuthenticating(false);
//         }
//       }
//       refresh();
//     }
//   }, [error?.status, setAccessToken, setIsAuthenticating]);

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen gap-2">
      {error.status === 404 ? (
        <img src="/404.svg" alt="404" className="w-[30%]" />
      ) : (
        <img src="/Error-page.svg" alt="Error" className="w-[30%]" />
      )}
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-red-600 font-bold text-xl">{message}</p>
      <p className="text-gray-600">
        {msgs.includes(details) ? "Session expired" : details}
      </p>
      <button
        onClick={() => navigate("/")}
        type="button"
        className="my-4 btn bg-blue-500 hover:bg-blue-700 text-white"
      >
        {msgs.includes(details) ? "Logout" : "Go back"}
      </button>
    </div>
  );
}
