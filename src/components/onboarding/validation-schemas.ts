import * as Yup from "yup";

// Step 1: Create Account Validation

export const step1ValidationSchema = Yup.object().shape({
  userType: Yup.string().required("user type is required"),
});

export const step2ValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number"),
});

// Step 2: Personal Information Validation
export const step4ValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
  phone: Yup.string()
    .matches(/^[0-9\s\-+$$$$]+$/, "Please enter a valid phone number")
    .required("Phone number is required"),
  address: Yup.string()
    .min(5, "Address must be at least 5 characters")
    .required("Address is required"),
  city: Yup.string()
    .min(2, "City must be at least 2 characters")
    .required("City is required"),
  postalCode: Yup.string().required("Postal code is required"),
  country: Yup.string().required("Country is required"),
});

// Step 5: Email Verification Validation
export const step3ValidationSchema = Yup.object().shape({
  verificationCode: Yup.string()
    .length(4, "Verification code must be 4 digits")
    .matches(/^[0-9]+$/, "Verification code must contain only numbers")
    .required("Verification code is required"),
});
