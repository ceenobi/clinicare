import ErrorAlert from "@/components/ErrorAlert";
import useMetaArgs from "@/hooks/useMeta";
import { RiLockFill } from "@remixicon/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/api/auth";
import FormField from "@/components/FormField";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@/utils/dataSchema";

export default function ForgotPassword() {
  useMetaArgs({
    title: "Forgot Password - Clinicare",
    description: "Forgot Password to your Clinicare account.",
    keywords: "Clinicare, forgot password, account",
  });
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Password reset link sent");
    },
    onError: (error) => {
      console.log(error);
      setError(
        error?.response?.data?.message || "Failed to send password link"
      );
    },
  });

  const onSubmit = async (data) => {
    mutation.mutate(data);
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
        <h1 className="text-2xl font-bold">Forgot Password</h1>
        <p className="text-muted-foreground text-center">
          Enter your email address and we'll send you a code to reset your
          password.
        </p>
        <div className="w-full md:w-[350px]">
          {error && <ErrorAlert error={error} />}
          <FormField
            label="Email"
            type="email"
            placeholder="Email"
            id="email"
            register={register}
            errors={errors}
            name="email"
          />
        </div>
        <button
          type="submit"
          className="btn bg-blue-500 hover:bg-blue-600 text-white w-full md:w-[350px]"
          disabled={isSubmitting || mutation.isPending}
        >
          {isSubmitting || mutation.isPending ? "Sending..." : "Send Link"}
        </button>
      </form>
    </div>
  );
}
