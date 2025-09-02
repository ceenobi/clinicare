import { updateDoctor } from "@/api/doctors";
import Modal from "@/components/Modal";
import { useAuth } from "@/store";
import { availability } from "@/utils/constants";
import { validateDoctorAvailabilitySchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiEditLine } from "@remixicon/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function EditDoctor({ doctor }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validateDoctorAvailabilitySchema),
  });
  useEffect(() => {
    if (doctor) {
      setValue("availability", doctor.availability);
    }
  }, [doctor, setValue]);

  const mutation = useMutation({
    mutationFn: updateDoctor,
    onSuccess: (response) => {
      if (response.status === 200) {
        setMsg(response?.data?.message);
        setShowSuccess(true);
      }
    },
    onError: (error) => {
      console.error(error);
      setError(
        error?.response?.data?.message || "Error updating doctor status"
      );
    },
  });

  const resetModal = async () => {
    await queryClient.invalidateQueries({ queryKey: ["getAllDoctors"] });
    setIsOpen(false);
    reset();
    setShowSuccess(false);
    setError(null);
  };

  const onSubmit = async (formData) => {
    mutation.mutate({ doctorId: doctor._id, formData, accessToken });
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} title="Edit room">
        <RiEditLine className="text-blue-500 cursor-pointer" />
      </button>
      <Modal
        isOpen={isOpen}
        id="editRoomModal"
        classname="bg-white p-4 rounded-xl shadow-lg w-[90%] max-w-[400px] mx-auto"
        title={`Edit doctor status`}
        showClose
        onClose={() => setIsOpen(false)}
      >
        {showSuccess ? (
          <>
            <div className="p-4 text-center max-w-[300px] mx-auto">
              <img
                src="/Success.svg"
                alt="success"
                className="w-full h-[200px]"
              />
              <h1 className="text-2xl font-bold">Congratulations!</h1>
              <p className="text-gray-600">{msg}</p>
              <button
                onClick={resetModal}
                className="my-4 btn bg-blue-500 hover:bg-blue-600 text-white"
              >
                Go back to Doctors
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            {error && <ErrorAlert error={error} />}
            <div className="md:grid grid-cols-12 gap-4">
              <div className="md:col-span-12">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Status</legend>
                  <select
                    defaultValue={""}
                    className="select capitalize w-full"
                    name="availability"
                    {...register("availability")}
                  >
                    <option value="">Doctor's Availability</option>
                    {availability?.map((option, index) => (
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
                {mutation.isPending ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
