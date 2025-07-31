import * as yup from "yup";

export const registerSchema: yup.AnyObjectSchema = yup.object({
  last_name: yup
    .string()
    .required("Last name is required.")
    .min(2, "Last name must contain 2-30 characters.")
    .max(30, "Last name must contain 2-30 characters."),
  first_name: yup
    .string()
    .required("First name is required.")
    .min(2, "First name must contain 2-30 characters.")
    .max(30, "First name must contain 2-30 characters."),
  username: yup
    .string()
    .required("Username is required.")
    .min(3, "Username must contain 3-20 characters.")
    .max(20, "Username must contain 3-20 characters."),
  email: yup.string().email("email is invalid.").required("Email is required."),
  password: yup
    .string()
    .required("Password is required.")
    .min(6, "Password must contains at least 6 characters."),
  confirm_password: yup
    .string()
    .required("Confirm password is required.")
    .oneOf([yup.ref("password")], "Confirm password does not match password."),
  phone_number: yup
    .string()
    .required("Phone number is required.")
    .matches(/^(?:84|0)(3|5|7|8|9)\d{8}$/, "Phone number is invalid."),
});
