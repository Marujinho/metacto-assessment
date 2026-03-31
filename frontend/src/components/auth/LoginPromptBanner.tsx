import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";

interface LoginPromptBannerProps {
  message?: string;
}

export function LoginPromptBanner({
  message = "Log in to submit feature requests and vote.",
}: LoginPromptBannerProps) {
  return (
    <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 text-center">
      <p className="text-sm text-indigo-700 mb-2">{message}</p>
      <Link
        to="/login"
        className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
      >
        <LogIn size={16} />
        Log in
      </Link>
    </div>
  );
}
