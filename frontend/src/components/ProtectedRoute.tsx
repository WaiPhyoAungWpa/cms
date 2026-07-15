import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { verifySession } from "../services/authService";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({
  children,
}: Props) {
  const token = localStorage.getItem("token");

  const [sessionStatus, setSessionStatus] = useState<
    "checking" | "valid" | "invalid"
  >(token ? "checking" : "invalid");

  useEffect(() => {
    let isCurrent = true;

    if (!token) {
      setSessionStatus("invalid");
      return;
    }

    verifySession(token).then((status) => {
      if (!isCurrent) {
        return;
      }

      if (status === "invalid") {
        localStorage.removeItem("token");
        setSessionStatus("invalid");
        return;
      }

      setSessionStatus("valid");
    });

    return () => {
      isCurrent = false;
    };
  }, [token]);

  if (sessionStatus === "checking") {
    return null;
  }

  if (sessionStatus === "invalid") {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}