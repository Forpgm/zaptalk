import { useForm, type SubmitHandler } from "react-hook-form";
import { registerSchema } from "../../schema/register.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import authApi from "../../apis/auth.api";
import { isAxiosUnprocessableEntityError } from "../../utils/errors";
import type { ErrorResponse } from "../../types/response.type";
import { toast } from "react-toastify";
import { path } from "../../constants/path";
import type { RegisterFormData } from "../../types/auth.type";
import { useNavigate } from "@tanstack/react-router";

export default function RegisterForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: yupResolver(registerSchema) });

  const values: RegisterFormData = watch();
  const isFilled: boolean = Object.values(values).every(
    (v: string) => v && v.toString().trim() !== ""
  );

  const registerMutation = useMutation({
    mutationFn: (body: Omit<RegisterFormData, "confirm_password">) =>
      authApi.registerAccount(body),
  });

  const onSubmit: SubmitHandler<RegisterFormData> = (data) => {
    registerMutation.mutate(data, {
      onSuccess: (data) => {
        toast.success("Register successfully", { position: "top-center" });
        navigate(path.emailVerify);
      },
      onError: (error) => {
        if (
          isAxiosUnprocessableEntityError<ErrorResponse<RegisterFormData>>(
            error
          )
        ) {
          const formErrors = error.response?.data.errors;

          if (Array.isArray(formErrors)) {
            formErrors.forEach((err) => {
              if (typeof err === "object" && "field" in err) {
                const fieldName = err.field as keyof Omit<
                  RegisterFormData,
                  "confirm_password"
                >;

                setError(fieldName, {
                  type: "server",
                  message: err.message,
                });
              }
            });
          }
        }
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col px-12 w-full"
    >
      <h1
        className="text-left text-5xl font-bold mb-6 text-[#69247C]"
        style={{ fontFamily: "Caprasimo" }}
      >
        Create New Account
      </h1>
      <div className="grid grid-cols-2 gap-y-4 gap-x-2 w-full px-10">
        {/* last name */}
        <div className="input-floating max-w-sm">
          <input
            type="text"
            placeholder="last name"
            className="input input-lg rounded-4xl bg-white"
            {...register("last_name")}
          />
          <div className="h-3 mb-1">
            {errors.last_name && (
              <p className="text-red-500 text-sm">{errors.last_name.message}</p>
            )}
          </div>
          <label className="input-floating-label">Last Name</label>
        </div>

        {/* first name */}
        <div className="input-floating max-w-sm">
          <input
            type="text"
            placeholder="first name"
            className="input input-lg rounded-4xl"
            {...register("first_name")}
          />
          <div className="h-3 mb-1">
            {errors.first_name && (
              <p className="text-red-500 text-sm">
                {errors.first_name.message}
              </p>
            )}
          </div>
          <label className="input-floating-label">First Name</label>
        </div>

        {/* email */}
        <div className="input-floating col-span-2">
          <input
            type="text"
            placeholder="email"
            className="input input-lg rounded-4xl w-full"
            {...register("email")}
          />
          <div className="h-3 mb-1">
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <label className="input-floating-label">Email</label>
        </div>

        {/* username */}
        <div className="input-floating col-span-2">
          <input
            type="text"
            placeholder="username"
            className="input input-lg rounded-4xl"
            {...register("username")}
          />
          <div className="h-3 mb-1">
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>
          <label className="input-floating-label">Username</label>
        </div>

        {/* phone number - chiếm nguyên dòng */}
        <div className="input-floating col-span-2">
          <input
            type="text"
            placeholder="phone number"
            className="input input-lg rounded-4xl w-full"
            {...register("phone_number")}
          />
          <div className="h-3 mb-1">
            {errors.phone_number && (
              <p className="text-red-500 text-sm">
                {errors.phone_number.message}
              </p>
            )}
          </div>
          <label className="input-floating-label">Phone Number</label>
        </div>

        {/* password */}
        <div className="input-floating max-w-sm">
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

        {/* confirm password */}
        <div className="input-floating max-w-sm">
          <input
            type="password"
            placeholder="confirm password"
            className="input input-lg rounded-4xl"
            {...register("confirm_password")}
          />
          <div className="h-3 mb-1">
            {errors.confirm_password && (
              <p className="text-red-500 text-sm">
                {errors.confirm_password.message}
              </p>
            )}
          </div>
          <label className="input-floating-label">Confirm Password</label>
        </div>
      </div>

      <div className="px-10">
        <button
          type="submit"
          disabled={!isFilled}
          className={`px-2 py-3 mt-4 rounded-full border text-[#69247C] hover:opacity-70 font-bold transition w-full self-start ${
            isFilled ? "cursor-pointer" : "cursor-not-allowed opacity-80"
          }`}
        >
          {isSubmitting ? "... Submitting" : "Register"}
        </button>
      </div>
    </form>
  );
}
