import { updateAppointmentPatients } from "@/api/appointments";
import ErrorAlert from "@/components/ErrorAlert";
import FormField from "@/components/FormField";
import Modal from "@/components/Modal";
import { useAuth } from "@/store";
import { formatDate } from "@/utils/constants";
import { validateBookAppointmentSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiEditLine } from "@remixicon/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function EditAppointment({ appointment }) {
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
    resolver: zodResolver(validateBookAppointmentSchema),
  });

  useEffect(() => {
    if (appointment) {
      setValue(
        "appointmentDate",
        formatDate(appointment?.appointmentDate, "input")
      );
      setValue("appointmentTime", appointment.appointmentTime);
      setValue("notes", appointment.notes);
    }
  }, [appointment, setValue]);
  
  const mutation = useMutation({
    mutationFn: updateAppointmentPatients,
    onSuccess: (response) => {
      if (response.status === 200) {
        setMsg(response?.data?.message);
        setShowSuccess(true);
      }
    },
    onError: (error) => {
      console.error(error);
      setError(error?.response?.data?.message || "Error updating appointment");
    },
  });

  const appointmentTime = ["10:00 AM", "1:00 PM", "3:00 PM"];

  const resetModal = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["getPatientAppointments"],
    });
    setIsOpen(false);
    reset();
    setShowSuccess(false);
    setError(null);
  };

  const onSubmit = async (formData) => {
    mutation.mutate({ appointmentId: appointment._id, formData, accessToken });
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} title="Edit appointment">
        <RiEditLine className="text-blue-500 cursor-pointer" />
      </button>
      <Modal
        isOpen={isOpen}
        id="editPatientAppointmentModal"
        classname="bg-white p-4 rounded-xl shadow-lg w-[90%] max-w-[600px] mx-auto"
        title={`Edit appointment`}
        showClose
        onClose={() => setIsOpen(false)}
      >
        {error && <ErrorAlert error={error} />}
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
              <div className="md:col-span-6">
                <FormField
                  label="Appointment Date"
                  id="appointmentDate"
                  register={register}
                  name="appointmentDate"
                  placeholder="Date"
                  errors={errors}
                  type="date"
                />
              </div>
              <div className="md:col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Appointment Time</legend>
                  <select
                    defaultValue={""}
                    className="select capitalize w-full"
                    name="appointmentTime"
                    {...register("appointmentTime")}
                  >
                    <option value="">Appointment Time</option>
                    {appointmentTime?.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors?.appointmentTime?.message && (
                    <span className="text-xs text-red-500">
                      {errors?.appointmentTime?.message}
                    </span>
                  )}
                </fieldset>
              </div>
              <div className="md:col-span-12">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Note</legend>
                  <textarea
                    className="textarea w-full"
                    placeholder="Enter short notes or ailment"
                    {...register("notes")}
                  ></textarea>
                  <p className="text-red-500 text-xs">
                    {errors.notes?.message}
                  </p>
                </fieldset>
              </div>
            </div>
            <div className="mt-6 mb-2 flex w-full justify-end gap-2">
              <button
                type="button"
                className="btn btn-outline w-[120px] border-[0.2px] border-gray-500"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn bg-blue-500 hover:bg-blue-600 text-white w-[120px]"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Booking..." : "Book"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
