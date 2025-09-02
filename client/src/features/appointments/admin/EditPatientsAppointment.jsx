import {
  getAppointmentMeta,
  updateAppointmentStatus,
} from "@/api/appointments";
import ErrorAlert from "@/components/ErrorAlert";
import Modal from "@/components/Modal";
import { useAuth } from "@/store";
import { validateConfirmAppointmentSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiEditLine } from "@remixicon/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function EditPatientsAppointment({ appointment }) {
  const { accessToken } = useAuth();
  const { isPending, data, error, isError } = useQuery({
    queryKey: ["getAppointmentsMeta", accessToken],
    queryFn: () => getAppointmentMeta(accessToken),
  });
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setError] = useState(null);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validateConfirmAppointmentSchema),
  });
  const doctors = data?.data?.data?.doctorMeta || [];
  const doctorsName = doctors?.map((doctor) => ({
    id: doctor.userId._id,
    name: doctor.userId.fullname,
  }));

  useEffect(() => {
    if (appointment) {
      setValue("status", appointment?.status);
      setValue(
        "doctorId",
        doctorsName?.find(
          (doctor) => doctor.name === appointment?.doctorId?.fullname
        )?.id
      );
      setValue("response", appointment?.response);
    }
  }, [appointment, doctorsName, setValue]);

  const mutation = useMutation({
    mutationFn: updateAppointmentStatus,
    onSuccess: (response) => {
      if (response.status === 200) {
        setMsg(response?.data?.message);
        setShowSuccess(true);
      }
    },
    onError: (error) => {
      console.error(error);
      setError(
        error?.response?.data?.message || "Error updating appointment status"
      );
    },
  });

  const status = ["scheduled", "confirmed", "cancelled"];

  if (isPending) {
    return <div className="my-4 text-center">Fetching doctors...</div>;
  }

  const resetModal = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["getAllAppointments"],
    });
    setIsOpen(false);
    reset();
    setShowSuccess(false);
    setError(null);
  };

  const onSubmit = async (formData) => {
    mutation.mutate({ appointmentId: appointment?._id, formData, accessToken });
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} title="Confirm appointment">
        <RiEditLine className="text-blue-500 cursor-pointer" />
      </button>
      <Modal
        isOpen={isOpen}
        id="confirmAppointmentModal"
        classname="bg-white p-4 rounded-xl shadow-lg w-[90%] max-w-[400px] mx-auto"
        title={`Confirm appointment`}
        showClose
        onClose={() => setIsOpen(false)}
      >
        {isError ||
          (err && <ErrorAlert error={error?.response?.data?.message || err} />)}
        {doctors?.length > 0 ? (
          <>
            {showSuccess ? (
              <>
                <div className="p-4 text-center max-w-[400px] mx-auto">
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
                    Go back to Appointments
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="md:grid grid-cols-12 gap-4">
                  <div className="md:col-span-12">
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend">Select Doctor</legend>
                      <select
                        defaultValue={""}
                        className="select capitalize w-full"
                        name="doctorId"
                        {...register("doctorId")}
                      >
                        <option value="">Select doctor</option>
                        {doctorsName?.map((option, index) => (
                          <option key={index} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                      {errors?.status?.message && (
                        <span className="text-xs text-red-500">
                          {errors?.status?.message}
                        </span>
                      )}
                    </fieldset>
                  </div>
                  <div className="md:col-span-12">
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend">
                        Confirm Status
                      </legend>
                      <select
                        defaultValue={""}
                        className="select capitalize w-full"
                        name="status"
                        {...register("status")}
                      >
                        <option value="">Select status</option>
                        {status?.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors?.status?.message && (
                        <span className="text-xs text-red-500">
                          {errors?.status?.message}
                        </span>
                      )}
                    </fieldset>
                  </div>
                  <div className="md:col-span-12">
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend">Response</legend>
                      <textarea
                        className="textarea w-full"
                        placeholder="Send a response to the patient concerning the booking"
                        {...register("response")}
                      ></textarea>
                      <p className="text-red-500 text-xs">
                        {errors.response?.message}
                      </p>
                    </fieldset>
                  </div>
                </div>
                <div className="mt-6 mb-2 flex w-full justify-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline w-[120px] border-[0.2px] border-gray-500"
                    onClick={() => {
                      setIsOpen(false);
                      setError(null);
                    }}
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
          </>
        ) : (
          <>
            <div className="p-4 text-center max-w-[400px] mx-auto">
              <img src="/Error.svg" alt="error" className="w-full h-[200px]" />
              <h1 className="text-lg font-bold mt-4">
                No Doctors available at the moment
              </h1>
              <p className="text-gray-600">{msg}</p>
              <button
                onClick={() => setIsOpen(false)}
                className="my-4 btn bg-blue-500 hover:bg-blue-600 text-white"
              >
                Go back to Appointments
              </button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
