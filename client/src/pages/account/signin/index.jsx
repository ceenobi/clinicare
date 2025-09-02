import useMetaArgs from "@/hooks/useMeta";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiUser4Fill } from "@remixicon/react";
import { validateSignInSchema } from "@/utils/dataSchema";
import FormField from "@/components/FormField";
import { Link, useNavigate } from "react-router";
import { loginUser } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import ErrorAlert from "@/components/ErrorAlert";
import { useAuth } from "@/store";

export default function Signin() {
  useMetaArgs({
    title: "Login - Clinicare",
    description:
      "Login to your Clinicare account to start managing your health easily.",
    keywords: "Clinicare, login, account",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(validateSignInSchema),
  });
  const { setAccessToken, user } = useAuth();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Login successful");
      setAccessToken(response?.data?.data?.accessToken);
      if (!user?.isVerified) {
        navigate("/verify-account");
      }
    },
    onError: (error) => {
      console.log(error);
      setError(error?.response?.data?.message || "Login failed");
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
        <RiUser4Fill
          size={40}
          className="text-blue-500 p-2 border-[0.2px] border-blue-500 rounded-full shadow-lg"
        />
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="text-gray-600">
          Glad to see you again. Log in to your account.
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
          <div>
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
            />
            <Link
              to="/account/forgot-password"
              className="text-blue-500 font-bold text-sm"
            >
              Forgot Password?
            </Link>
          </div>
        </div>
        <button
          type="submit"
          className="my-4 btn bg-blue-500 hover:bg-blue-600 text-white w-full md:w-[350px]"
          disabled={isSubmitting || mutation.isPending}
        >
          {isSubmitting || mutation.isPending ? "Signing In..." : "Sign In"}
        </button>
        <p className="text-gray-600 text-sm">
          Don't have an account?{" "}
          <Link to="/account/signup" className="text-blue-500 font-bold">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
