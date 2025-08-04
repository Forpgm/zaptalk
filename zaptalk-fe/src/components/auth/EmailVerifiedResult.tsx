import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { path } from "../../constants/path";
import authApi from "../../apis/auth.api";
import { useMutation } from "@tanstack/react-query";
import type { ErrorResponse } from "../../types/response.type";
import {
  setAccessTokenToLocalStorage,
  setProfileToLocalStorage,
} from "../../utils/auth";

export interface VerifyEmailRequestBody {
  email_verify_token: string;
}

export default function EmailVerifiedResult() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("email_verify_token") ?? "";

  const emailVerifyMutation = useMutation({
    mutationFn: (body: VerifyEmailRequestBody) => authApi.verifyEmail(body),
    onSuccess: (response) => {
      setStatus("success");
      toast.success(response.data.data.message, { position: "top-center" });
      setAccessTokenToLocalStorage(response.data.data.access_token);
      setProfileToLocalStorage(response.data.data.user);
      navigate(path.inbox);
    },
    onError: (error: ErrorResponse<any>) => {
      setStatus("error");
      toast.error(error.message, {
        position: "top-center",
      });
    },
  });

  const { mutate } = emailVerifyMutation;

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }
    mutate({ email_verify_token: token });
  }, [token, mutate]);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      {status === "loading" && (
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Verifying your email...</p>
        </div>
      )}

      {status === "success" && (
        <div className="text-center">
          <h1 className="text-4xl font-bold text-green-600 mb-4">Verified!</h1>
          <p className="text-gray-700 text-lg mb-6">
            Your email has been successfully verified. You can now log in to
            your account.
          </p>
          <button
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            onClick={() => navigate(path.login)}
          >
            Go to Login
          </button>
        </div>
      )}

      {status === "error" && (
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            Verification Failed
          </h1>
          <p className="text-gray-700 text-lg mb-6">
            The verification link is invalid or has expired. Please request a
            new verification email.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-6 py-3 bg-[#69247C] text-white font-semibold rounded-lg hover:opacity-80 transition"
              onClick={() => navigate("/email-verify")}
            >
              Resend Email
            </button>
            <button
              className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition"
              onClick={() => navigate(path.home)}
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
