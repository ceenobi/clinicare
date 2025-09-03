import { bookAppointment } from "@/api/appointments";
import ErrorAlert from "@/components/ErrorAlert";
import FormField from "@/components/FormField";
import Modal from "@/components/Modal";
import SelectField from "@/components/SelectField";
import { useAuth } from "@/store";
import { validateBookAppointmentSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function BookAppointment() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validateBookAppointmentSchema),
  });
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: bookAppointment,
    onSuccess: (response) => {
      if (response.status === 201) {
        setMsg(response?.data?.message);
        setShowSuccess(true);
      }
    },
    onError: (error) => {
      console.error(error);
      setError(error?.response?.data?.message || "Error booking appointmnent");
    },
  });
  const appointmentTime = ["10:00 AM", "1:00 PM", "3:00 PM"];

  const resetModal = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["getPatientAppointments"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["getAllAppointments"],
      }),
    ]);
    setIsOpen(false);
    setShowSuccess(false);
    reset();
  };

  const onSubmit = async (formData) => {
    mutation.mutate({ formData, accessToken });
  };

  return (
    <>
      <button
        className="btn bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        Book Appointment
      </button>
      <Modal
        isOpen={isOpen}
        id="bookAppointmentModal"
        classname="bg-white p-4 rounded-xl shadow-lg w-[90%] max-w-[600px] mx-auto"
        title={`${showSuccess ? "" : "Book Appointment"}`}
        showClose
        onClose={resetModal}
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
                <SelectField
                  label="Appointment Time"
                  id="appointmentTime"
                  register={register}
                  name="appointmentTime"
                  placeholder="Time"
                  data={appointmentTime}
                  errors={errors}
                />
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
                onClick={resetModal}
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
