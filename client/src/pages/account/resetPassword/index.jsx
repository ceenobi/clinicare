import ErrorAlert from "@/components/ErrorAlert";
import FormField from "@/components/FormField";
import useMetaArgs from "@/hooks/useMeta";
import { validateResetPasswordSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiLockFill } from "@remixicon/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { resetPassword } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router";

export default function ResetPassword() {
  useMetaArgs({
    title: "Reset Password - Clinicare",
    description: "Reset Password to your Clinicare account.",
    keywords: "Clinicare, reset password, account",
  });
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const [isVisibleConfirmPassword, setIsVisibleConfirmPassword] =
    useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(validateResetPasswordSchema),
  });
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // look for values on our url bar
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      navigate("/account/signin");
    },
    onError: (error) => {
      import.meta.env.DEV && console.log(error);
      setError(error?.response?.data?.message);
    },
  });

  const onSubmit = async (data) => {
    const userData = { ...data, email, token };
    mutation.mutate(userData);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow w-full max-w-[400px]">
      <form
        className="flex flex-col items-center gap-2 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <RiLockFill
          size={40}
          className="text-blue-500 p-2 border-[0.2px] border-blue-500 rounded-full shadow"
        />
        <h1 className="text-2xl font-bold">Create New Password</h1>
        <p className="text-gray-600 text-center">
          Please enter a new password. Your new password must be different from
          your previous password.
        </p>
        <div className="w-full md:w-[350px]">
          {error && <ErrorAlert error={error} />}
          <FormField
            label="Password"
            type="password"
            placeholder="Password"
            id="password"
            register={register}
            errors={errors}
            name="password"
            isVisible={isVisiblePassword}
            setIsVisible={setIsVisiblePassword}
          />
          <FormField
            label="Confirm Password"
            type="password"
            placeholder="Confirm Password"
            id="confirmPassword"
            register={register}
            errors={errors}
            name="confirmPassword"
            isVisible={isVisibleConfirmPassword}
            setIsVisible={setIsVisibleConfirmPassword}
          />
        </div>
        <button
          type="submit"
          className="mt-2 btn bg-blue-500 hover:bg-blue-600 text-white w-full md:w-[350px]"
          disabled={isSubmitting || mutation.isPending}
        >
          {isSubmitting || mutation.isPending
            ? "Resetting..."
            : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
