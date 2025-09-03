import FormField from "@/components/FormField";
import Modal from "@/components/Modal";
import { useAuth } from "@/store";
import { validateRoomSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiEditLine } from "@remixicon/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { updateRoom } from "@/api/room";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ErrorAlert from "@/components/ErrorAlert";
import SelectField from "@/components/SelectField";

export default function EditRoom({ room }) {
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
    resolver: zodResolver(validateRoomSchema),
  });

  useEffect(() => {
    if (room) {
      setValue("roomNumber", room.roomNumber);
      setValue("roomDescription", room.roomDescription);
      setValue("roomType", room.roomType);
      setValue("roomCapacity", room.roomCapacity);
      setValue("roomPrice", room.roomPrice);
      setValue("roomStatus", room.roomStatus);
      setValue("isFilled", room.isFilled);
    }
  }, [room, setValue]);

  const mutation = useMutation({
    mutationFn: updateRoom,
    onSuccess: (response) => {
      if (response.status === 200) {
        setMsg(response?.data?.message);
        setShowSuccess(true);
      }
    },
    onError: (error) => {
      console.error(error);
      setError(error?.response?.data?.message || "Error updating room");
    },
  });

  const roomType = ["Regular", "VIP", "ICU", "Deluxe", "Suite"];
  const roomStatus = ["available", "occupied", "maintenance"];

  const resetModal = async () => {
    await queryClient.invalidateQueries({ queryKey: ["getAllRooms"] });
    setIsOpen(false);
    reset();
    setShowSuccess(false);
    setError(null);
  };

  const onSubmit = async (formData) => {
    mutation.mutate({ roomId: room._id, formData, accessToken });
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} title="Edit room">
        <RiEditLine className="text-blue-500 cursor-pointer" />
      </button>
      <Modal
        isOpen={isOpen}
        id="addRoomModal"
        classname="bg-white p-4 rounded-xl shadow-lg w-[90%] max-w-[600px] mx-auto"
        title={`Edit room ${room?.roomNumber}`}
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
                <SelectField
                  label="Room Type"
                  id="roomType"
                  register={register}
                  name="roomType"
                  placeholder="Room Type"
                  data={roomType}
                  errors={errors}
                />
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
                <SelectField
                  label="Room Status"
                  id="roomStatus"
                  register={register}
                  name="roomStatus"
                  placeholder="Room Status"
                  data={roomStatus}
                  errors={errors}
                />
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
                {mutation.isPending ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
