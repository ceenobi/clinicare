import { RiErrorWarningLine } from "@remixicon/react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function ErrorAlert({ error }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (error === "jwt expired") {
      navigate(0);
    }
  }, [error, navigate]);
  return (
    <>
      {error !== "jwt expired" && (
        <div role="alert" className="alert bg-red-400 text-white">
          <RiErrorWarningLine className="text-white" />
          <span className="text-sm">Error! {error}</span>
        </div>
      )}
    </>
  );
}
