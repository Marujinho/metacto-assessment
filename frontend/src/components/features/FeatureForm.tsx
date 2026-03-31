import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCreateFeature } from "../../hooks/useCreateFeature";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { getErrorMessage, getFieldErrors } from "../../lib/errorMessages";
import { LoginPromptBanner } from "../auth/LoginPromptBanner";
import { SimilarFeaturesAlert } from "./SimilarFeaturesAlert";
import type { Feature, FeatureFormData, SimilarFeature } from "../../types/feature";
import { useState } from "react";

interface FeatureFormProps {
  feature?: Feature;
  onSubmit?: (data: FeatureFormData) => Promise<void>;
  submitLabel?: string;
}

export function FeatureForm({ feature, onSubmit, submitLabel }: FeatureFormProps) {
  const { isAuthenticated } = useRequireAuth();
  const navigate = useNavigate();
  const createFeature = useCreateFeature();
  const [similarFeatures, setSimilarFeatures] = useState<SimilarFeature[]>([]);

  const isEdit = !!feature;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FeatureFormData>({
    defaultValues: {
      title: feature?.title ?? "",
      description: feature?.description ?? "",
    },
  });

  if (!isAuthenticated) {
    return <LoginPromptBanner message="Log in to submit feature requests." />;
  }

  const handleFormSubmit = async (data: FeatureFormData) => {
    if (onSubmit) {
      try {
        await onSubmit(data);
      } catch (error) {
        const fieldErrors = getFieldErrors(error);
        if (fieldErrors) {
          Object.entries(fieldErrors).forEach(([field, messages]) => {
            if (field in data) {
              setError(field as keyof FeatureFormData, {
                message: messages[0],
              });
            }
          });
        } else {
          toast.error(getErrorMessage(error));
        }
      }
      return;
    }

    try {
      const result = await createFeature.mutateAsync(data);
      if (result.similar_features && result.similar_features.length > 0) {
        setSimilarFeatures(result.similar_features);
        toast.success("Feature created! Similar features found below.");
      } else {
        toast.success("Feature submitted!");
      }
      navigate(`/features/${result.feature.slug}`);
    } catch (error) {
      const fieldErrors = getFieldErrors(error);
      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, messages]) => {
          if (field in data) {
            setError(field as keyof FeatureFormData, {
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
    <div className="space-y-4">
      <SimilarFeaturesAlert features={similarFeatures} />

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="feature-title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            id="feature-title"
            type="text"
            placeholder="Short, descriptive title..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            {...register("title", {
              required: "Title is required",
              maxLength: { value: 200, message: "Title is too long" },
            })}
            aria-invalid={errors.title ? "true" : undefined}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="feature-desc"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="feature-desc"
            rows={4}
            placeholder="Describe the feature you want..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-y"
            {...register("description", {
              required: "Description is required",
              maxLength: { value: 2000, message: "Description is too long" },
            })}
            aria-invalid={errors.description ? "true" : undefined}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {isSubmitting
            ? "Submitting..."
            : submitLabel ?? (isEdit ? "Save changes" : "Submit feature")}
        </button>
      </form>
    </div>
  );
}
