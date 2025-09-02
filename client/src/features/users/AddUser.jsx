import ErrorAlert from "@/components/ErrorAlert";
import FormField from "@/components/FormField";
import Modal from "@/components/Modal";
import { validateSignUpSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createUserAdmins } from "@/api/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/store";
import { availability, specialization } from "@/utils/constants";

export default function AddUser() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDoctor, setShowDoctor] = useState(false);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(validateSignUpSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "Techstudio!!",
      role: "staff",
    },
  });

  const mutation = useMutation({
    mutationFn: createUserAdmins,
    onSuccess: (response) => {
      if (response.status === 201) {
        setMsg(response?.data?.message);
        setShowSuccess(true);
      }
    },
    onError: (error) => {
      console.error(error);
      setError(error?.response?.data?.message || "Error updating user role");
    },
  });

  const roles = ["admin", "staff", "doctor", "nurse", "patient"];
  
  const fieldWatch = watch("role");
  useEffect(() => {
    if (fieldWatch === "doctor") {
      setShowDoctor(true);
    } else {
      setShowDoctor(false);
    }
  }, [fieldWatch]);

  const resetModal = async () => {
    await queryClient.invalidateQueries({ queryKey: ["getAllUsers"] });
    setIsOpen(false);
    reset();
    setShowSuccess(false);
    setError(null);
  };

  const onSubmit = (data) => {
    if (
      (data.role === "doctor" && !data.specialization) ||
      (data.role === "doctor" && !data.availability)
    ) {
      setError("Please select doctor's specialization and availability");
      return;
    }
    mutation.mutate({ userData: data, accessToken });
  };

  return (
    <>
      <button
        className="bg-blue-500 text-white font-bold border border-gray-300 p-2 rounded-md cursor-pointer w-[140px]"
        onClick={() => setIsOpen(true)}
      >
        Add user
      </button>
      <Modal
        isOpen={isOpen}
        id="addNewUserModal"
        classname="bg-white p-4 rounded-xl shadow-lg w-[90%] max-w-[600px] mx-auto"
        title={`${showSuccess ? "" : "Create User"}`}
        showClose
        onClose={() => setIsOpen(false)}
      >
        {showSuccess ? (
          <>
            <div className="p-4 text-center max-w-[300px] mx-auto">
              <img
                src="/Success.svg"
                alt="success"
                className="w-full h-[250px]"
              />
              <h1 className="text-2xl font-bold">Congratulations!</h1>
              <p className="text-gray-600">{msg}</p>
              <button
                onClick={resetModal}
                className="my-4 btn bg-blue-500 hover:bg-blue-600 text-white"
              >
                Go back to Users
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            {error && <ErrorAlert error={error} />}
            <div className="md:grid grid-cols-12 gap-4">
              <div className="md:col-span-6">
                <FormField
                  label="Full Name"
                  id="fullname"
                  register={register}
                  name="fullname"
                  placeholder="Full Name"
                  errors={errors}
                  type="text"
                />
              </div>
              <div className="md:col-span-6">
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
              <div className="md:col-span-6">
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
                  defaultValue="Techstudio!!"
                />
              </div>
              <div className="md:col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Role</legend>
                  <select
                    defaultValue={"staff"}
                    className="select capitalize w-full"
                    name="role"
                    {...register("role")}
                    disabled={isSubmitting}
                  >
                    <option value="">Select Role</option>
                    {roles
                      ?.filter((role) => role !== "patient")
                      .map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                  </select>
                  {errors?.role?.message && (
                    <span className="text-xs text-red-500">
                      {errors?.role?.message}
                    </span>
                  )}
                </fieldset>
              </div>
              {showDoctor && (
                <>
                  <div className="md:col-span-6">
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend">
                        Specialization
                      </legend>
                      <select
                        defaultValue={""}
                        className="select capitalize w-full"
                        name="specialization"
                        {...register("specialization")}
                        disabled={isSubmitting}
                      >
                        <option value="">Select Specialization</option>
                        {specialization.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors?.specialization?.message && (
                        <span className="text-xs text-red-500">
                          {errors?.specialization?.message}
                        </span>
                      )}
                    </fieldset>
                  </div>
                  <div className="md:col-span-6">
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend">Availability</legend>
                      <select
                        defaultValue={""}
                        className="select capitalize w-full"
                        name="availability"
                        {...register("availability")}
                        disabled={isSubmitting}
                      >
                        <option value="">Select Availability</option>
                        {availability.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors?.availability?.message && (
                        <span className="text-xs text-red-500">
                          {errors?.availability?.message}
                        </span>
                      )}
                    </fieldset>
                  </div>
                </>
              )}
            </div>
            <div className="mt-6 mb-2 flex w-full justify-end gap-2">
              <button
                type="button"
                className="btn btn-outline w-[120px] border-[0.2px] border-gray-500"
                onClick={resetModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn bg-blue-500 hover:bg-blue-600 text-white w-[120px]"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Adding..." : "Add User"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
