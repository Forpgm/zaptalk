import { useState } from "react";
import { toast } from "react-toastify";

export default function EmailVerify() {
  const [loading, setLoading] = useState(false);
  const handleResend = async () => {
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      toast.success("Verification email resent!", { position: "top-center" });
    } catch (error) {
      toast.error("Failed to resend email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-start bg-white">
      {/* check your email */}
      <h1
        className="text-4xl md:text-5xl font-bold text-[#69247C] mt-12 text-center"
        style={{ fontFamily: "Caprasimo" }}
      >
        Check Your Email
      </h1>

      <div className="mt-10 text-center text-xl px-4 max-w-xl">
        We have sent a verification email to your inbox. Please check your email
        and follow the instructions to activate your account.
      </div>

      <img
        src="https://i.pinimg.com/736x/c3/35/63/c335633c368fb66a7abee8315fdac1a9.jpg"
        className="w-full max-w-4xl h-[50vh] object-contain my-8"
        alt="Email Verification Banner"
      />

      {/* resent btn */}
      <button
        className="px-6 py-3 bg-[#69247C] text-white font-semibold rounded-lg hover:opacity-80 transition"
        onClick={() => handleResend()}
      >
        {loading ? "... Sending" : "Resend Verification Email"}
      </button>
    </div>
  );
}
