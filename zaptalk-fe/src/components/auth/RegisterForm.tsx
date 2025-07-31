import { useForm, type SubmitHandler } from "react-hook-form";
import { registerSchema } from "../../schema/register.schema";
import { yupResolver } from "@hookform/resolvers/yup";

interface RegisterFormData {
  first_name: string;
  last_name: string;
  username: string;
  phone_number: string;
  email: string;
  password: string;
  confirm_password: string;
}

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: yupResolver(registerSchema) });
  const onSubmit: SubmitHandler<RegisterFormData> = (data: RegisterFormData) =>
    console.log(data);

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
      <div className="grid grid-cols-2 gap-y-4 gap-x-2 w-full">
        {/* last name */}
        <div className="input-floating max-w-sm">
          <input
            type="text"
            placeholder="last name"
            className="input input-xl rounded-4xl"
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
            className="input input-xl rounded-4xl"
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
        <div className="input-floating max-w-sm">
          <input
            type="email"
            placeholder="email"
            className="input input-xl rounded-4xl"
            {...register("email")}
          />
          <div className="h-3 mb-1">
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <label className="input-floating-label">Email</label>
        </div>
        {/* phone number */}
        <div className="input-floating max-w-sm">
          <input
            type="text"
            placeholder="phone number"
            className="input input-xl rounded-4xl"
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
            className="input input-xl rounded-4xl"
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
            className="input input-xl rounded-4xl"
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
      <button
        type="submit"
        className="px-4 py-2 mt-10 rounded-full text-[#A19AD3] font-bold transition w-full self-start"
      >
        Register
      </button>
    </form>
  );
}
