import * as yup from "yup";

export const loginSchema: yup.AnyObjectSchema = yup.object({
  emailOrPhone: yup.string().required("Email or Phone Number is required."),
  password: yup
    .string()
    .required("Password is required.")
    .min(6, "Password must contains at least 6 characters."),
});
