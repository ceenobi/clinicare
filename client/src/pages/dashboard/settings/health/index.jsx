import ErrorAlert from "@/components/ErrorAlert";
import FormField from "@/components/FormField";
import useMetaArgs from "@/hooks/useMeta";
import { useAuth } from "@/store";
import { bloodGroup, formatDate } from "@/utils/constants";
import { validatePatientSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { getPatient, updatePatient } from "@/api/patients";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LazyLoader } from "@/components/LazyLoader";

export default function Health() {
  useMetaArgs({
    title: "Health - Clinicare",
    description: "Health settings for your Clinicare account.",
    keywords: "Clinicare, health, settings",
  });
  const [err, setError] = useState(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validatePatientSchema),
  });
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["patient", accessToken],
    queryFn: () => getPatient(accessToken),
  });
  const patientData = data?.data?.data;
  useEffect(() => {
    if (user) {
      setValue("fullname", user.fullname);
      setValue("email", user.email);
      setValue("phone", user.phone || "");
      setValue("dateOfBirth", formatDate(user.dateOfBirth || "", "input"));
    }
    if (patientData) {
      setValue("gender", patientData?.gender || "");
      setValue("bloodGroup", patientData?.bloodGroup || "");
      setValue("address", patientData?.address || "");
      setValue("emergencyContact", patientData?.emergencyContact || "");
      setValue(
        "emergencyContactPhone",
        patientData?.emergencyContactPhone || ""
      );
      setValue(
        "emergencyContactRelationship",
        patientData?.emergencyContactRelationship || ""
      );
    }
  }, [user, setValue, patientData]);

  const mutation = useMutation({
    mutationFn: updatePatient,
    onSuccess: (res) => {
      if (res.status === 200) {
        toast.success(res.data?.message);
        queryClient.invalidateQueries({ queryKey: ["patient"] });
      }
    },
    onError: (error) => {
      import.meta.env.DEV && console.log(error);
      setError(error?.response?.data?.message || "Error updating your profile");
    },
  });

  const gender = ["male", "female", "other"];
  const bloodGroupOptions = Object.entries(bloodGroup).map(([key, value]) => ({
    id: value,
    name: key,
  }));

  if (isPending) {
    return <LazyLoader />;
  }

  const onSubmit = async (formData) => {
    mutation.mutate({
      patientId: patientData._id,
      formData,
      accessToken,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="font-bold text-2xl border-b border-gray-300 pb-2">
        Health Information
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        id="/dashboard/settings/health"
        className="pb-6 md:pb-2"
      >
        {isError ||
          (err && <ErrorAlert error={error?.response?.data?.message || err} />)}
        <div className="my-4 md:grid grid-cols-12 gap-4">
          <div className="md:col-span-6">
            <FormField
              label="Full name"
              id="fullname"
              register={register}
              name="fullname"
              placeholder="Full name"
              errors={errors}
              type="text"
            />
          </div>
          <div className="md:col-span-6">
            <FormField
              label="Email"
              id="email"
              register={register}
              name="email"
              placeholder="Email"
              errors={errors}
              type="email"
            />
          </div>
          <div className="md:col-span-6">
            <FormField
              label="Phone"
              id="phone"
              register={register}
              name="phone"
              placeholder="Phone"
              errors={errors}
              type="tel"
            />
          </div>
          <div className="md:col-span-6">
            <FormField
              label="Date of birth"
              id="dateOfBirth"
              register={register}
              name="dateOfBirth"
              placeholder="Date of birth"
              errors={errors}
              type="date"
            />
          </div>

          <div className="md:col-span-6">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Gender</legend>
              <select
                defaultValue={""}
                className="select capitalize w-full"
                name="gender"
                {...register("gender")}
              >
                <option value="">Select Gender</option>
                {gender?.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors?.gender?.message && (
                <span className="text-xs text-red-500">
                  {errors?.gender?.message}
                </span>
              )}
            </fieldset>
          </div>
          <div className="md:col-span-6">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Blood Group</legend>
              <select
                defaultValue={""}
                className="select capitalize w-full"
                name="bloodGroup"
                {...register("bloodGroup")}
              >
                <option value="">Select BloodGroup</option>
                {bloodGroupOptions?.map((option, index) => (
                  <option key={index} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
              {errors?.bloodGroup?.message && (
                <span className="text-xs text-red-500">
                  {errors?.bloodGroup?.message}
                </span>
              )}
            </fieldset>
          </div>
          <div className="md:col-span-12">
            <FormField
              label="Address"
              id="address"
              register={register}
              name="address"
              placeholder="Address"
              errors={errors}
              type="text"
            />
          </div>
          <div className="md:col-span-6">
            <FormField
              label="Emergency contact"
              id="emergencyContact"
              register={register}
              name="emergencyContact"
              placeholder="Emergency contact"
              errors={errors}
              type="text"
            />
          </div>
          <div className="md:col-span-6">
            <FormField
              label="Emergency contact phone"
              id="emergencyContactPhone"
              register={register}
              name="emergencyContactPhone"
              placeholder="Emergency contact phone"
              errors={errors}
              type="tel"
            />
          </div>
          <div className="md:col-span-6">
            <FormField
              label="Emergency contact relationship"
              id="emergencyContactRelationship"
              register={register}
              name="emergencyContactRelationship"
              placeholder="Emergency contact relationship"
              errors={errors}
              type="text"
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
    </div>
  );
}
