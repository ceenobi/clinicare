import useMetaArgs from "@/hooks/useMeta";
import { useAuth } from "@/store";
import { RiMailFill } from "@remixicon/react";
import { useEffect, useState } from "react";
import PinField from "react-pin-field";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyAccount, resendVerificationCode } from "@/api/auth";
import { toast } from "sonner";
import ErrorAlert from "@/components/ErrorAlert";
import { useNavigate } from "react-router";

export default function VerifyAccount() {
  useMetaArgs({
    title: "Verify Account - Clinicare",
    description: "Verify your Clinicare account.",
    keywords: "Clinicare, verify account, account",
  });
  const [verificationToken, setVerificationToken] = useState("");
  const [timer, setTimer] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { accessToken, user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const TIMER_STORAGE_KEY = "verification_time_end";

  useEffect(() => {
    const savedEndTime = localStorage.getItem(TIMER_STORAGE_KEY);
    if (savedEndTime) {
      const endTime = parseInt(savedEndTime, 10);
      const now = Math.floor(Date.now() / 1000);
      const remaining = Math.max(0, endTime - now);

      if (remaining > 0) {
        setTimer(remaining);
        setIsResendDisabled(true);
      } else {
        localStorage.removeItem(TIMER_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    let interval;
    // Stop the timer if verification was successful
    if (timer > 0) {
      setIsResendDisabled(true);
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1 && interval !== null) {
            setIsResendDisabled(false);
            clearInterval(interval);
            localStorage.removeItem(TIMER_STORAGE_KEY);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval !== null) {
        clearInterval(interval);
      }
    };
  }, [timer]);

  const mutation = useMutation({
    mutationFn: verifyAccount,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Account verified");
      queryClient.invalidateQueries({ queryKey: ["auth_user"] });
      setSuccess(true);
    },
    onError: (error) => {
      console.log(error);
      setError(error?.response?.data?.message || "Account verifcation failed");
    },
  });

  const sendResendToken = useMutation({
    mutationFn: resendVerificationCode,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Verification token sent");
    },
    onError: (error) => {
      console.log(error);
      setError(error?.response?.data?.message || "Verification code failed");
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    mutation.mutate({ verificationToken, accessToken });
  };

  const handleResendCode = async (e) => {
    e.preventDefault();
    const newTimer = 120;
    setTimer(newTimer);
    const endTime = Math.floor(Date.now() / 1000) + newTimer;
    localStorage.setItem(TIMER_STORAGE_KEY, endTime.toString());
    if (!accessToken) {
      toast.error("Session expired. Please refresh the page and try again.");
      return;
    }
    sendResendToken.mutate(accessToken);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-6rem)] gap-2">
      {success || user?.isVerified ? (
        <>
          {" "}
          <div className="p-4 max-w-[800px] mx-auto text-center">
            <img src="/Success.svg" alt="success" className="w-full h-full" />
            <h1 className="text-2xl font-bold">Congratulations!</h1>
            <p className="text-gray-600">
              {user?.isVerified
                ? "Your account has already been verified."
                : "Your account has been verified successfully."}
            </p>
            <button
              className="btn my-4 bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
              size="lg"
              onClick={() => navigate("/", { replace: true })}
            >
              Go back to home
            </button>
          </div>
        </>
      ) : (
        <div className="bg-white p-4 rounded-xl shadow w-full max-w-[400px]">
          <form
            className="flex flex-col items-center gap-2 w-full"
            onSubmit={onSubmit}
          >
            <RiMailFill
              size={40}
              className="text-blue-500 p-2 border-[0.2px] border-blue-500 rounded-full shadow-lg"
            />
            <h1 className="text-2xl font-bold">OTP Verification</h1>
            <p className="text-gray-600 text-center">
              We have sent a verification code to your email. Please enter it
              below.
            </p>
            <div className="my-4 w-full md:w-[350px] text-center">
              {error && <ErrorAlert error={error} />}
              <PinField
                length={6}
                autoComplete="one-time-code"
                autoCorrect="off"
                dir="ltr"
                pattern="[0-9]"
                type="text"
                value={verificationToken}
                onChange={(value) => {
                  setVerificationToken(value);
                }}
                className="w-[50px] sm:w-[58px] text-center border border-gray-300 rounded-md p-2 font-bold my-2"
              />
            </div>
            <button
              type="submit"
              className="btn bg-blue-500 hover:bg-blue-600 text-white w-full md:w-[350px]"
              disabled={verificationToken.length !== 6 || mutation.isPending}
            >
              {mutation.isPending ? "Verifying..." : "Verify"}
            </button>
          </form>
          <div>
            <form
              onSubmit={handleResendCode}
              className="mt-4 flex flex-col items-center gap-2 w-full"
            >
              <p className="text-[var(--paint-gray)] text-sm">
                Did not receive a code? or Code expired?
              </p>
              <button
                className={`btn bg-blue-500 hover:bg-blue-600 ${
                  isResendDisabled
                    ? "text-black cursor-not-allowed"
                    : "text-white"
                }`}
                type="submit"
                disabled={isResendDisabled}
              >
                {isResendDisabled ? `Resend in ${timer}s` : "Resend Code"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
