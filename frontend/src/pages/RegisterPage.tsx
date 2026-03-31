import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { RegisterForm } from "../components/auth/RegisterForm";

export function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-sm py-12">
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
        Create an account
      </h1>
      <p className="text-sm text-gray-500 text-center mb-6">
        Join the community to submit and vote on features.
      </p>

      <RegisterForm
        onSuccess={() => {
          toast.success("Account created. Please log in.");
          navigate("/login", {
            state: { message: "Account created successfully. Please log in." },
          });
        }}
      />

      <p className="mt-4 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
