import * as yup from "yup";

export const Yup = {
  password: yup
    .string()
    .required("No password provided.")
    .min(8, "Password is too short - should be 8 chars minimum.")
    .matches(
      /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character."
    ),
  required: yup.string().required("This is a required field"),
  email: yup.string().required("This is a required field").email(),
} as const;
