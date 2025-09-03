import FormField from "@/components/FormField";
import useMetaArgs from "@/hooks/useMeta";
import { validatePatientSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { bloodGroup, formatDate } from "@/utils/constants";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerPatient } from "@/api/patients";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import ErrorAlert from "@/components/ErrorAlert";

export default function PatientsOnboard() {
  useMetaArgs({
    title: "Patients Onboard - Clinicare",
    description: "Complete your patient profile.",
    keywords: "Clinicare, patients, account",
  });
  const { user, accessToken } = useAuth();
  const [currentStep, setCurrentStep] = useState(
    user?.isCompletedOnboard ? 3 : 1
  );
  const [field, setField] = useState(false);
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(validatePatientSchema),
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const gender = ["male", "female", "other"];
  const bloodGroupOptions = Object.entries(bloodGroup).map(([key, value]) => ({
    name: key,
    id: value,
  }));

  useEffect(() => {
    if (user) {
      setValue("fullname", user.fullname);
      setValue("email", user.email);
      setValue("phone", user.phone || "");
      setValue("dateOfBirth", formatDate(user.dateOfBirth || "", "input"));
      setValue("gender", user.gender);
      setValue("bloodGroup", user.bloodGroup);
      setValue("address", user.address);
      setValue("emergencyContact", user.emergencyContact);
      setValue("emergencyContactPhone", user.emergencyContactPhone);
      setValue(
        "emergencyContactRelationship",
        user.emergencyContactRelationship
      );
    }
  }, [user, setValue]);

  const requiredFields1 = useMemo(
    () => ["fullname", "email", "phone", "dateOfBirth", "gender", "bloodGroup"],
    []
  );
  const requiredFields2 = useMemo(
    () => [
      "address",
      "emergencyContact",
      "emergencyContactPhone",
      "emergencyContactRelationship",
    ],
    []
  );
  const formValues = watch();
  
  useEffect(() => {
    const currentRequiredFields =
      currentStep === 1 ? requiredFields1 : requiredFields2;
    const hasEmptyFields = currentRequiredFields.some(
      (field) => !formValues[field] || formValues[field] === ""
    );
    const hasErrors = currentRequiredFields.some((field) => errors[field]);
    setField(hasEmptyFields || hasErrors);
  }, [formValues, errors, currentStep, requiredFields1, requiredFields2]);

  const mutation = useMutation({
    mutationFn: registerPatient,
    onSuccess: (response) => {
      if (response.status === 201) {
        toast.success(response?.data?.message);
        //clear old user data
        queryClient.invalidateQueries({ queryKey: ["auth_user"] });
      }
    },
    onError: (error) => {
      import.meta.env.DEV && console.log(error);
      setError(
        error?.response?.data?.message || "Error registering your details"
      );
    },
  });

  const handleStep = () => {
    if (currentStep === 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (formData) => {
 mutation.mutate({ formData, accessToken });
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex flex-col items-start md:items-center justify-center gap-2">
      <h1 className="mt-10 md:mt-0 text-2xl font-bold">Patients Onboard</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="my-4 w-full max-w-[600px] mx-auto bg-white p-4 rounded-xl shadow"
      >
        <p className="text-muted-foreground text-center font-medium mb-2">
          Hello <b>{user?.fullname}</b>,{" "}
          {user?.isCompletedOnboard
            ? "Onboarding completed"
            : "please complete your patient profile"}
        </p>
        {error && <ErrorAlert error={error} />}
        <ul className="steps flex justify-center my-2">
          <li
            className={`step w-full ${
              currentStep === 1 ? "step-primary" : ""
            } `}
          >
            Details
          </li>
          <li
            className={`step w-full ${
              currentStep === 2 ? "step-primary" : ""
            } `}
          >
            Contact
          </li>
          <li
            className={`step w-full ${
              currentStep === 3 ? "step-primary" : ""
            } `}
          >
            Save
          </li>
        </ul>
        <div className="my-4 md:grid grid-cols-12 gap-4">
          {currentStep === 1 && (
            <>
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
            </>
          )}
          {currentStep === 2 && (
            <>
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
                  placeholder="Emergency contact name"
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
            </>
          )}

          {currentStep === 3 && (
            <div className="md:col-span-12 p-4 text-center">
              <img
                src="/Success.svg"
                alt="success"
                className="w-full h-[200px]"
              />
              <h1 className="text-2xl font-bold">Congratulations!</h1>
              <p className="text-gray-600">
                "Your account has been verified successfully."
              </p>
              <button
                className="btn my-4 bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                size="lg"
                onClick={() => navigate("/dashboard", { replace: true })}
              >
                Continue to dashboard
              </button>
            </div>
          )}
        </div>
        <div className="flex gap-4 justify-end">
          {currentStep === 1 && (
            <button
              className="btn bg-zinc-800 font-bold text-white w-[140px] cursor-pointer"
              onClick={handleStep}
              disabled={field}
            >
              Next
            </button>
          )}
          {currentStep === 2 && (
            <div className="w-full flex justify-center items-center  md:justify-end gap-4">
              <button
                className="btn bg-zinc-800 font-bold text-white w-[140px] cursor-pointer"
                onClick={handleStep}
              >
                Previous
              </button>
              <button
                className="bg-blue-500 text-white font-bold p-2 rounded-md cursor-pointer w-[140px]"
                disabled={mutation.isPending || field}
                type="submit"
              >
                {mutation.isPending ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
