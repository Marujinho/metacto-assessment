import { AxiosError } from "axios";

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError && error.response?.data?.detail) {
    return error.response.data.detail;
  }
  return "Something went wrong. Please try again.";
}

export function getFieldErrors(
  error: unknown
): Record<string, string[]> | null {
  if (error instanceof AxiosError && error.response?.data?.field_errors) {
    return error.response.data.field_errors;
  }
  return null;
}
