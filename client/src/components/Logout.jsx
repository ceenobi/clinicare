import Modal from "./Modal";
import { useState } from "react";
import { RiLogoutCircleRLine } from "@remixicon/react";
import { useLocation, useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "@/api/auth";
import { toast } from "sonner";
import { useAuth } from "@/store";

export default function Logout() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const queryClient = useQueryClient();
  const { accessToken, setAccessToken } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["auth_user"] });
      setIsOpen(false);
      setAccessToken(null);
      navigate("/account/signin");
    },
    onError: (error) => {
      console.error(error);
      toast.error(error?.response?.data?.message);
    },
  });

  const onLogout = async () => {
    mutation.mutate(accessToken);
  };

  return (
    <>
      <button
        className={`${
          location.pathname === "/verify-account"
            ? "btn bg-red-500 hover:bg-red-600 text-white"
            : ""
        } p-4 flex gap-2 items-center text-base cursor-pointer text-red-500`}
        onClick={() => setIsOpen(true)}
      >
        <RiLogoutCircleRLine /> Logout
      </button>
      <Modal
        id="logoutModal"
        isOpen={isOpen}
        classname="bg-white p-4 rounded-xl shadow w-[90%] max-w-[400px] mx-auto"
      >
        <div className="flex flex-col items-center gap-2 w-full">
          <RiLogoutCircleRLine size={40} className="text-red-500" />
          <h1 className="text-2xl font-bold">Logout</h1>
          <p className="text-center">
            Are you sure you want to be logged out from your account?
          </p>
          <div className="mt-4 mb-2 flex gap-2">
            <button
              type="button"
              className="btn btn-outline w-[150px] border-[0.2px] border-gray-500"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn bg-red-500 hover:bg-red-600 text-white w-[150px]"
              type="button"
              disabled={mutation.isPending}
              onClick={onLogout}
            >
              {mutation.isPending ? "Logging out..." : "Yes, Logout"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
