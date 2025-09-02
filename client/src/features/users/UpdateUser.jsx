import ErrorAlert from "@/components/ErrorAlert";
import Modal from "@/components/Modal";
import { validateUpdateUserRoleSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserRole } from "@/api/auth";
import { useAuth } from "@/store";
import { availability, specialization } from "@/utils/constants";

export default function UpdateUser({ item, onClose, isOpen }) {
  const [error, setError] = useState(null);
  const [success, ShowSuccess] = useState(false);
  const [msg, setMsg] = useState("");
  const [showDoctor, setShowDoctor] = useState(false);
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validateUpdateUserRoleSchema),
  });
  const mutation = useMutation({
    mutationFn: updateUserRole,
    onSuccess: (response) => {
      if (response.success) {
        setMsg(response?.message);
        ShowSuccess(true);
      }
    },
    onError: (error) => {
      console.error(error);
      setError(error?.response?.data?.message || "Error updating user role");
    },
  });

  useEffect(() => {
    if (item) {
      setValue("role", item?.role);
    }
  }, [item, setValue]);

  const fieldWatch = watch("role");
  useEffect(() => {
    if (fieldWatch === "doctor") {
      setShowDoctor(true);
    } else {
      setShowDoctor(false);
    }
  }, [fieldWatch]);

  const roles = ["admin", "staff", "doctor", "nurse", "patient"];

  const onSubmit = async (role) => {
    mutation.mutate({ userId: item._id, role, accessToken });
  };

  const handleClose = async () => {
    await queryClient.invalidateQueries({ queryKey: ["getAllUsers"] });
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        id="updateUserModal"
        classname="bg-white p-4 rounded-xl shadow-lg w-[90%] max-w-[400px] mx-auto"
        showClose
        onClose={onClose}
        title="Update user role"
      >
        {error && <ErrorAlert error={error} />}
        {success ? (
          <>
            <div className="p-4 text-center">
              <img
                src="/Success.svg"
                alt="success"
                className="w-full h-[200px]"
              />
              <h1 className="text-2xl font-bold">Congratulations!</h1>
              <p className="text-gray-600">{msg}</p>
              <button
                className="btn my-4 bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                size="lg"
                onClick={handleClose}
              >
                Continue to Users
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="md:grid grid-cols-12 gap-4">
              <div className="col-span-12">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Role</legend>
                  <select
                    defaultValue={item.role}
                    className="select capitalize w-full"
                    name="role"
                    {...register("role")}
                  >
                    <option value="">Select Role</option>
                    {roles
                      ?.filter((role) => role !== "patient")
                      ?.map((option, index) => (
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
                        disabled={mutation.isPending}
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
                        disabled={mutation.isPending}
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
            <div className="mt-6 mb-2 flex w-full justify-center md:justify-end gap-2">
              <button
                type="button"
                className="btn btn-outline w-[120px] border-[0.2px] border-gray-500"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn bg-blue-500 hover:bg-blue-600 text-white w-[120px]"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
