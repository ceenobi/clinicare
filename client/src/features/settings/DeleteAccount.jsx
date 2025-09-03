import { deleteAccount } from "@/api/auth";
import ErrorAlert from "@/components/ErrorAlert";
import Modal from "@/components/modal";
import { useAuth } from "@/store";
import { RiDeleteBinLine } from "@remixicon/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function DeleteAccount() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const { accessToken, setAccessToken } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: async (response) => {
      if (response.status === 200) {
        toast.success(response?.data?.message);
        //clears all cached keys from tanstack query
        queryClient.clear();
        setAccessToken(null);
      }
    },
    onError: (error) => {
      import.meta.env.DEV && console.log(error);
      setError(error?.response?.data?.message || "Error deleting your account");
    },
  });

  const onDelete = async () => {
    mutation.mutate(accessToken);
  };

  return (
    <>
      <button
        className="btn flex gap-2 items-center text-base cursor-pointer bg-red-500 text-white w-full md:w-fit"
        onClick={() => setIsOpen(true)}
      >
        Delete Account
      </button>
      <Modal
        isOpen={isOpen}
        id="deleteAccountModal"
        classname="bg-white p-4 rounded-xl shadow-lg w-[90%] max-w-[400px] mx-auto"
      >
        <div className="flex flex-col items-center gap-2 w-full">
          <RiDeleteBinLine
            size={40}
            className="text-red-500 p-2 border-[0.2px] border-red-500 rounded-full shadow-lg"
          />
          <h1 className="text-2xl font-bold">Delete account</h1>
          <p className="text-center">
            Are you sure you want to delete your account?
          </p>
          {error && <ErrorAlert error={error} />}
          <div className="mt-4 mb-2 flex gap-2">
            <button
              type="button"
              className="btn w-[160px] border-[0.2px] border-gray-500"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <>
              <button
                type="submit"
                className="btn bg-red-500 hover:bg-red-600 text-white w-[160px]"
                disabled={mutation.isPending}
                onClick={onDelete}
              >
                {mutation.isPending ? "Deleting..." : "Yes, Delete"}
              </button>
            </>
          </div>
        </div>
      </Modal>
    </>
  );
}
