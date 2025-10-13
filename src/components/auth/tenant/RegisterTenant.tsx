import { useFormik } from "formik";
import * as Yup from "yup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  useAuthRegister,
  useAuthResendOtp,
  useAuthVerifyEmail,
} from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { setAuth } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hook";

// Step 1: Registration validation schema
const registrationValidationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords don't match")
    .required("Confirm password is required"),
  isAgency: Yup.string().required("Please select an option"),
});

// Step 2: Verify email validation schema
const verifyEmailValidationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  code: Yup.string()
    .min(6, "Code must be at least 6 characters")
    .required("Verification code is required"),
});

function RegisterTenant({ currentStep, onStepChange }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);

  const { mutateAsync: authRegister } = useAuthRegister();
  const { mutateAsync: authVerifyEmail } = useAuthVerifyEmail();
  const { mutateAsync: authResendOtp } = useAuthResendOtp();

  const handleResendOTP = async () => {
    try {
      const email = verifyEmailFormik.values.email;

      if (!email) {
        toast.error("Email is required");
        return;
      }

      const res = await authResendOtp({
        email,
      });

      const result = await res.data;
      console.log(result);

      toast.success("OTP resent successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to resend OTP");
    }
  };

  // Step 1: Registration Form
  const registrationFormik = useFormik({
    initialValues: {
      firstName: "John",
      lastName: "Doe",
      email: "thernloven16578@outlook.com",
      password: "password123",
      confirmPassword: "password123",
      isAgency: true,
    },
    validationSchema: registrationValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        setLoading(true);

        await authRegister({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          isAgency: values.isAgency === "true",
        });

        toast.success("OTP sent to your email for verification");

        // Pre-fill email in verification form
        verifyEmailFormik.setFieldValue("email", values.email);
        // Move to step 2
        onStepChange(2);
      } catch (error: any) {
        verifyEmailFormik.setFieldValue("email", values.email);
        onStepChange(2);
        toast.error(error.message || "Failed to register");
      } finally {
        setLoading(false);
      }
    },
  });

  // Step 2: Verify Email Form
  const verifyEmailFormik = useFormik({
    initialValues: {
      email: "",
      code: "",
    },
    validationSchema: verifyEmailValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const userData: any = await authVerifyEmail({
          email: values.email,
          code: values.code,
        });

        const data = {
          token: userData.data.token,
          user: userData.data.user,
        };

        localStorage.setItem("token", data.token);
        dispatch(setAuth({ token: data.token, user: data.user }));

        toast.success("Email verified successfully!");
        navigate("/listings");
      } catch (error: any) {
        toast.error(error.message || "Verification failed");
      } finally {
        setLoading(false);
      }
    },
  });

  // Render Step 1: Registration Form
  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-text-primary font-medium">First Name</Label>
        <Input
          name="firstName"
          value={registrationFormik.values.firstName}
          onChange={registrationFormik.handleChange}
          onBlur={registrationFormik.handleBlur}
          placeholder="Enter your first name"
          className="h-12 border-muted focus:border-primary focus:ring-primary"
        />
        {registrationFormik.touched.firstName &&
          registrationFormik.errors.firstName && (
            <p className="text-sm text-destructive">
              {registrationFormik.errors.firstName}
            </p>
          )}
      </div>

      <div className="space-y-2">
        <Label className="text-text-primary font-medium">Last Name</Label>
        <Input
          name="lastName"
          value={registrationFormik.values.lastName}
          onChange={registrationFormik.handleChange}
          onBlur={registrationFormik.handleBlur}
          placeholder="Enter your last name"
          className="h-12 border-muted focus:border-primary focus:ring-primary"
        />
        {registrationFormik.touched.lastName &&
          registrationFormik.errors.lastName && (
            <p className="text-sm text-destructive">
              {registrationFormik.errors.lastName}
            </p>
          )}
      </div>

      <div className="space-y-2">
        <Label className="text-text-primary font-medium">Email Address</Label>
        <Input
          name="email"
          type="email"
          value={registrationFormik.values.email}
          onChange={registrationFormik.handleChange}
          onBlur={registrationFormik.handleBlur}
          placeholder="Enter your email"
          className="h-12 border-muted focus:border-primary focus:ring-primary"
        />
        {registrationFormik.touched.email &&
          registrationFormik.errors.email && (
            <p className="text-sm text-destructive">
              {registrationFormik.errors.email}
            </p>
          )}
      </div>

      <div className="space-y-2">
        <Label className="text-text-primary font-medium">Is Agency?</Label>
        <select
          name="isAgency"
          value={registrationFormik.values.isAgency}
          onChange={registrationFormik.handleChange}
          onBlur={registrationFormik.handleBlur}
          className="w-full h-12 px-3 py-2 text-sm bg-white border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary"
        >
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>
        {registrationFormik.touched.isAgency &&
          registrationFormik.errors.isAgency && (
            <p className="text-sm text-destructive">
              {registrationFormik.errors.isAgency}
            </p>
          )}
      </div>

      <div className="space-y-2">
        <Label className="text-text-primary font-medium">Password</Label>
        <Input
          name="password"
          type="password"
          value={registrationFormik.values.password}
          onChange={registrationFormik.handleChange}
          onBlur={registrationFormik.handleBlur}
          placeholder="Create a password"
          className="h-12 border-muted focus:border-primary focus:ring-primary"
        />
        {registrationFormik.touched.password &&
          registrationFormik.errors.password && (
            <p className="text-sm text-destructive">
              {registrationFormik.errors.password}
            </p>
          )}
      </div>

      <div className="space-y-2">
        <Label className="text-text-primary font-medium">
          Confirm Password
        </Label>
        <Input
          name="confirmPassword"
          type="password"
          value={registrationFormik.values.confirmPassword}
          onChange={registrationFormik.handleChange}
          onBlur={registrationFormik.handleBlur}
          placeholder="Confirm your password"
          className="h-12 border-muted focus:border-primary focus:ring-primary"
        />
        {registrationFormik.touched.confirmPassword &&
          registrationFormik.errors.confirmPassword && (
            <p className="text-sm text-destructive">
              {registrationFormik.errors.confirmPassword}
            </p>
          )}
      </div>
      <Button
        type="button"
        onClick={() => registrationFormik.handleSubmit()}
        disabled={loading}
        className="w-full h-12 bg-primary hover:bg-primary-dark text-white text-lg font-medium rounded-xl"
      >
        {getButtonText()}
      </Button>
    </div>
  );

  // Render Step 2: Verify Email Form
  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-text-primary font-medium">Email Address</Label>
        <Input
          name="email"
          type="email"
          value={verifyEmailFormik.values.email}
          onChange={verifyEmailFormik.handleChange}
          onBlur={verifyEmailFormik.handleBlur}
          placeholder="Enter your email"
          className="h-12 border-muted focus:border-primary focus:ring-primary"
        />
        {verifyEmailFormik.touched.email && verifyEmailFormik.errors.email && (
          <p className="text-sm text-destructive">
            {verifyEmailFormik.errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-text-primary items-center flex justify-between font-medium">
          <div>Verification Code</div>
          <Button
            variant="link"
            type="button"
            size="sm"
            onClick={handleResendOTP}
            disabled={loading}
            className="text-sm text-primary mt-2"
          >
            Resend OTP
          </Button>
        </Label>
        <Input
          name="code"
          value={verifyEmailFormik.values.code}
          onChange={verifyEmailFormik.handleChange}
          onBlur={verifyEmailFormik.handleBlur}
          placeholder="Enter OTP"
          className="h-12 border-muted focus:border-primary focus:ring-primary"
        />
        {verifyEmailFormik.touched.code && verifyEmailFormik.errors.code && (
          <p className="text-sm text-destructive">
            {verifyEmailFormik.errors.code}
          </p>
        )}
      </div>

      <Button
        type="button"
        onClick={() => verifyEmailFormik.handleSubmit()}
        disabled={loading}
        className="w-full h-12 bg-primary text-white rounded-xl"
      >
        {loading ? "Verifying..." : "Verify Email"}
      </Button>
    </div>
  );

  const handleButtonClick = () => {
    if (currentStep === 1) {
      registrationFormik.handleSubmit();
    }
  };

  const getButtonText = () => {
    if (loading) return "Loading...";
    if (currentStep === 1) return "Continue";
    return "Verify Email";
  };

  const renderCurrentStep = () => {
    if (currentStep === 1) return renderStep1();
    if (currentStep === 2) return renderStep2();
    return null;
  };
  return <div>{renderCurrentStep()}</div>;
}

export default RegisterTenant;
