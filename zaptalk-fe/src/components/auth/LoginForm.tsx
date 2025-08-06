import { useNavigate } from "react-router-dom";
import { loginSchema } from "../../schema/login.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import type { LoginFormData } from "../../types/auth.type";
import { isAxiosUnprocessableEntityError } from "../../utils/errors";
import { useMutation } from "@tanstack/react-query";
import authApi from "../../apis/auth.api";
import { toast } from "react-toastify";
import { path } from "../../constants/path";
import type { ErrorResponse } from "../../types/response.type";

export default function LoginForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: yupResolver(loginSchema) });

  const values: LoginFormData = watch();
  const isFilled: boolean = Object.values(values).every(
    (v: string) => v && v.toString().trim() !== ""
  );

  const loginMutation = useMutation({
    mutationFn: (body: LoginFormData) => authApi.login(body),
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (
    data: LoginFormData
  ) => {
    await loginMutation.mutateAsync(data, {
      onSuccess: (data) => {
        toast.success("Login successfully", { position: "top-center" });
        navigate(path.inbox);
      },
      onError: (error) => {
        if (
          isAxiosUnprocessableEntityError<ErrorResponse<LoginFormData>>(error)
        ) {
          const formError = error.response?.data.errors;
          if (formError && Array.isArray(formError)) {
            formError.forEach((err) => {
              const fieldName = err.field as keyof LoginFormData;
              setError(fieldName, {
                type: "server",
                message: err.message,
              });
            });
          }
        }
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-center text-center px-12 w-3/4"
    >
      <h1
        className="text-5xl font-bold mb-6 text-[#69247C]"
        style={{ fontFamily: "Caprasimo" }}
      >
        Sign In
      </h1>
      <div className="input-floating">
        <input
          type="text"
          placeholder="email/phone number"
          className="input input-lg rounded-4xl w-full"
          {...register("emailOrPhone")}
        />
        <div className="h-3 mb-1">
          {errors.emailOrPhone && (
            <p className="text-red-500 text-sm">
              {errors.emailOrPhone.message}
            </p>
          )}
        </div>
        <label className="input-floating-label">Email or Phone Number</label>
      </div>
      <div className="input-floating">
        <input
          type="password"
          placeholder="password"
          className="input input-lg rounded-4xl"
          {...register("password")}
        />
        <div className="h-3 mb-1">
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
        <label className="input-floating-label">Password</label>
      </div>
      <button
        type="submit"
        disabled={!isFilled}
        className={`${
          isFilled ? "cursor-pointer" : "cursor-not-allowed"
        } mt-4 px-12 py-2 w-full border rounded-full text-[#69247C] font-semibold uppercasetransition`}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center  rounded-lg dark:bg-gray-800 dark:border-gray-700">
            <svg
              aria-hidden="true"
              className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-[#69247C]"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          "Login"
        )}
      </button>
    </form>
  );
}
