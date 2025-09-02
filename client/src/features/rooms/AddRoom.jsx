import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/store";
import { createRoom } from "@/api/room";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { validateRoomSchema } from "@/utils/dataSchema";
import Modal from "@/components/Modal";
import FormField from "@/components/FormField";
import ErrorAlert from "@/components/ErrorAlert";

export default function AddRoom() {
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
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validateRoomSchema),
  });
  const mutation = useMutation({
    mutationFn: createRoom,
    onSuccess: (response) => {
      if (response.status === 201) {
        setMsg(response?.data?.message);
        setShowSuccess(true);
      }
    },
    onError: (error) => {
      console.error(error);
      setError(error?.response?.data?.message || "Error creating room");
    },
  });

  const roomType = ["Regular", "VIP", "ICU", "Deluxe", "Suite"];
  const roomStatus = ["available", "occupied", "maintenance"];

  const resetModal = async () => {
    await queryClient.invalidateQueries({ queryKey: ["getAllRooms"] });
    setIsOpen(false);
    setShowSuccess(false);
    reset();
    setError(null);
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
        Add Room
      </button>
      <Modal
        isOpen={isOpen}
        id="addRoomModal"
        classname="bg-white p-4 rounded-xl shadow-lg w-[90%] max-w-[600px] mx-auto"
        title={`${showSuccess ? "" : "Add New Room"}`}
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
                Go back to Rooms
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            {error && <ErrorAlert error={error} />}
            <div className="md:grid grid-cols-12 gap-4">
              <div className="md:col-span-6">
                <FormField
                  label="Room Number"
                  id="roomNumber"
                  name="roomNumber"
                  placeholder="Room Number (1-20)"
                  type="number"
                  errors={errors}
                  register={register}
                />
              </div>
              <div className="md:col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Room Type</legend>
                  <select
                    defaultValue={""}
                    className="select capitalize w-full"
                    name="roomType"
                    {...register("roomType")}
                    disabled={mutation.isPending}
                  >
                    <option value="">Room Type</option>
                    {roomType?.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors?.roomType?.message && (
                    <span className="text-xs text-red-500">
                      {errors?.roomType?.message}
                    </span>
                  )}
                </fieldset>
              </div>
              <div className="md:col-span-6">
                <FormField
                  label="Room Price"
                  id="roomPrice"
                  register={register}
                  name="roomPrice"
                  placeholder="Room Price"
                  errors={errors}
                  type="number"
                />
              </div>
              <div className="md:col-span-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Room Status</legend>
                  <select
                    defaultValue={""}
                    className="select capitalize w-full"
                    name="roomStatus"
                    {...register("roomStatus")}
                    disabled={mutation.isPending}
                  >
                    <option value="">Room Status</option>
                    {roomStatus?.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors?.roomStatus?.message && (
                    <span className="text-xs text-red-500">
                      {errors?.roomStatus?.message}
                    </span>
                  )}
                </fieldset>
              </div>
              <div className="md:col-span-12">
                <FormField
                  label="Room Description"
                  id="roomDescription"
                  register={register}
                  name="roomDescription"
                  placeholder="Room Description"
                  errors={errors}
                  type="text"
                />
              </div>
              <div className="md:col-span-6">
                <FormField
                  label="Room Capacity"
                  id="roomCapacity"
                  register={register}
                  name="roomCapacity"
                  placeholder="Room Capacity (1-5)"
                  errors={errors}
                  type="number"
                />
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
                {mutation.isPending ? "Adding..." : "Add Room"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
