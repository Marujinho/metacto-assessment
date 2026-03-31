import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage, getFieldErrors } from "../../lib/errorMessages";
import toast from "react-hot-toast";
import type { RegisterData } from "../../types/user";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { register: registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>();

  const onSubmit = async (data: RegisterData) => {
    try {
      await registerUser(data);
      onSuccess?.();
    } catch (error) {
      const fieldErrors = getFieldErrors(error);
      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, messages]) => {
          if (field in data) {
            setError(field as keyof RegisterData, {
              message: messages[0],
            });
          }
        });
      } else {
        toast.error(getErrorMessage(error));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="reg-username" className="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <input
          id="reg-username"
          type="text"
          autoComplete="username"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
          {...register("username", { required: "Username is required" })}
          aria-invalid={errors.username ? "true" : undefined}
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="reg-email"
          type="email"
          autoComplete="email"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
          {...register("email", { required: "Email is required" })}
          aria-invalid={errors.email ? "true" : undefined}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="reg-password"
          type="password"
          autoComplete="new-password"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "At least 8 characters" },
          })}
          aria-invalid={errors.password ? "true" : undefined}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="reg-password-confirm" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm password
        </label>
        <input
          id="reg-password-confirm"
          type="password"
          autoComplete="new-password"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
          {...register("password_confirm", {
            required: "Please confirm your password",
          })}
          aria-invalid={errors.password_confirm ? "true" : undefined}
        />
        {errors.password_confirm && (
          <p className="mt-1 text-sm text-red-600">
            {errors.password_confirm.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
