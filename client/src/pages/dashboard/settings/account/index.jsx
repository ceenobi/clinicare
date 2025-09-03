import FormField from "@/components/FormField";
import DeleteAccount from "@/features/settings/DeleteAccount";
import UploadImage from "@/features/settings/UploadImage";
import { formatDate } from "@/utils/constants";
import { validateUserSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateUserProfile } from "@/api/auth";
import { toast } from "sonner";
import { useAuth } from "@/store";
import useMetaArgs from "@/hooks/useMeta";

export default function Account() {
  useMetaArgs({
    title: "Account - Clinicare",
    description: "Account settings for your Clinicare account.",
    keywords: "Clinicare, account, settings",
  });
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validateUserSchema),
  });
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user) {
      setValue("fullname", user.fullname);
      setValue("email", user.email);
      setValue("phone", user.phone || "");
      setValue("dateOfBirth", formatDate(user.dateOfBirth || "", "input"));
    }
  }, [setValue, user]);

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: async (response) => {
      if (response.status === 200) {
        toast.success(response?.data?.message);
        queryClient.invalidateQueries({ queryKey: ["auth_user"] });
      }
    },
    onError: (error) => {
      import.meta.env.DEV && console.log(error);
      setError(error?.response?.data?.message || "Error updating your profile");
    },
  });

  const onSubmit = async (userData) => {
    mutation.mutate({ userData, accessToken });
  };

  return (
    <div className="space-y-6">
      <h1 className="font-bold text-2xl border-b border-gray-300 pb-2">
        Account
      </h1>
      <>
        <UploadImage />
        <form
          onSubmit={handleSubmit(onSubmit)}
          id="/dashboard/settings/account"
          className="border-b border-gray-300 pb-6 md:pb-2"
        >
          {error && <ErrorAlert error={error} />}
          <div className="my-4 md:grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <FormField
                label="Full name"
                type="text"
                placeholder="Full name"
                id="fullname"
                register={register}
                errors={errors}
                name="fullname"
                classname="w-full"
              />
            </div>
            <div className="col-span-6">
              <FormField
                label="Email"
                type="email"
                placeholder="Email"
                id="email"
                register={register}
                errors={errors}
                name="email"
                classname="w-full"
              />
            </div>
            <div className="col-span-6">
              <FormField
                label="Phone"
                type="tel"
                placeholder="Phone"
                id="phone"
                register={register}
                errors={errors}
                name="phone"
                classname="w-full"
              />
            </div>
            <div className="col-span-6">
              <FormField
                label="Date of birth"
                type="date"
                placeholder="Date of birth"
                id="dateOfBirth"
                register={register}
                errors={errors}
                name="dateOfBirth"
                classname="w-full"
              />
            </div>
          </div>
          <div className="mt-6 flex md:hidden gap-4 justify-center">
            <button
              type="button"
              className="btn btn-outline w-[140px] border border-gray-300"
              onClick={() => navigate(-1)}
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
      </>
      <div className="md:flex justify-between items-center">
        <div className="mb-6 md:mb-0 md:w-[50%]">
          <h1 className="font-bold text-xl">Delete account</h1>
          <p className="text-sm text-muted-foreground">
            When you delete your account, you lose access to medical history and
            appointments. We permanently delete your account and all associated
            data.
          </p>
        </div>
        <DeleteAccount />
      </div>
    </div>
  );
}
