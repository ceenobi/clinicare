import useMetaArgs from "@/hooks/useMeta";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiUser4Fill } from "@remixicon/react";
import { validateSignUpSchema } from "@/utils/dataSchema";
import FormField from "@/components/FormField";
import { Link } from "react-router";
import { registerUser } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import ErrorAlert from "@/components/ErrorAlert";
import { useAuth } from "@/store";

export default function Signup() {
  useMetaArgs({
    title: "Register - Clinicare",
    description:
      "Create your Clinicare account to start managing your health easily.",
    keywords: "Clinicare, register, account",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(validateSignUpSchema),
  });
  const { setAccessToken } = useAuth();
  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (response) => {
      //what you want to do if api call is a success
      toast.success(response?.data?.message || "Registration successful");
      //save accessToken
      setAccessToken(response?.data?.data?.accessToken);
    },
    onError: (error) => {
      console.log(error);
      setError(error?.response?.data?.message || "Registration failed");
    },
  });

  const onSubmit = async (data) => {
    mutation.mutate(data); //submiting our form to our mutation function to help us make the api call using our registerUser api
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
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="text-gray-600 text-center">
          Join Clinicare to start managing your health easily.
        </p>
        <div className="w-full md:w-[350px]">
          {error && <ErrorAlert error={error} />}
          <FormField
            label="Full name"
            type="text"
            placeholder="Full name"
            id="fullname"
            register={register}
            errors={errors}
            name="fullname"
          />
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
          {isSubmitting || mutation.isPending
            ? "Creating Account..."
            : "Create Account"}
        </button>
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/account/signin" className="text-blue-500 font-bold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
