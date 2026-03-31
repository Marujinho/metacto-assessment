import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export function useRequireAuth() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const requireAuth = useCallback(
    (action: () => void) => {
      if (!isAuthenticated) {
        toast("Log in to continue", { icon: "\u{1F512}" });
        navigate("/login", { state: { from: location.pathname } });
        return;
      }
      action();
    },
    [isAuthenticated, navigate, location.pathname]
  );

  return { isAuthenticated, requireAuth };
}
