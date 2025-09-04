import useMetaArgs from "@/hooks/useMeta";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { updatePasswordSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserPassword, logout } from "@/api/auth";
import { useAuth } from "@/store";
import FormField from "@/components/FormField";
import ErrorAlert from "@/components/ErrorAlert";

export default function Password() {
  useMetaArgs({
    title: "Password - Clinicare",
    description: "Password settings for your Clinicare account.",
    keywords: "Clinicare, password, settings",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isNewVisible, setIsNewVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();
  const { accessToken, setAccessToken } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updatePasswordSchema),
  });
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: updateUserPassword,
    onSuccess: async (response) => {
      if (response.status === 200) {
        toast.success(response?.data?.message);
        // After password update, log the user out
        try {
          const res = await logout(accessToken);
          if (res.status === 200) {
            setAccessToken(null);
            queryClient.invalidateQueries({ queryKey: ["auth_user"] });
          }
        } catch {
          // fall back to local cleanup even if API logout fails
          queryClient.invalidateQueries({ queryKey: ["auth_user"] });
          setAccessToken(null);
          navigate("/account/signin");
        }
      }
    },
    onError: (error) => {
      import.meta.env.DEV && console.log(error);
      setError(error?.response?.data?.message || "Error updating password");
    },
  });

  const onSubmit = async (userData) => {
    mutation.mutate({ userData, accessToken });
  };

  return (
    <div className="space-y-6">
      <h1 className="font-bold text-2xl border-b border-gray-300 pb-2">
        Update Password
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        id="/dashboard/settings/password"
        className="max-w-[400px] mx-auto"
      >
        {error && <ErrorAlert error={error} />}
        <FormField
          label="Password"
          type="password"
          placeholder="Password"
          id="password"
          register={register}
          errors={errors}
          name="password"
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          classname="w-full"
        />
        <FormField
          label="New Password"
          type="password"
          placeholder="New Password"
          id="newPassword"
          register={register}
          errors={errors}
          name="newPassword"
          isVisible={isNewVisible}
          setIsVisible={setIsNewVisible}
          classname="w-full"
        />
        <FormField
          label="Confirm Password"
          type="password"
          placeholder="Confirm Password"
          id="confirmPassword"
          register={register}
          errors={errors}
          name="confirmPassword"
          isVisible={isConfirmVisible}
          setIsVisible={setIsConfirmVisible}
          classname="w-full"
        />
        <p className="my-2 text-gray-600 text-sm">
          Note: You will be logged out after updating your password.
        </p>
        <div className="my-6 flex md:hidden gap-4 justify-center">
          <button
            type="button"
            className="btn btn-outline w-[140px] border border-gray-300"
            onClick={() => navigate("/dashboard/settings")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold border border-gray-300 p-2 rounded-md cursor-pointer w-[140px]"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
