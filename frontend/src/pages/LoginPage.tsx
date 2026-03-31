import { Link, useLocation, useNavigate } from "react-router-dom";
import { LoginForm } from "../components/auth/LoginForm";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? "/";
  const message = (location.state as { message?: string })?.message;

  return (
    <div className="mx-auto w-full max-w-sm py-12">
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
        Welcome back
      </h1>
      <p className="text-sm text-gray-500 text-center mb-6">
        Log in to vote on features and submit requests.
      </p>

      {message && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700 text-center">
          {message}
        </div>
      )}

      <LoginForm onSuccess={() => navigate(from, { replace: true })} />

      <p className="mt-4 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="text-indigo-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
