// components/auth/SignInWithEmail.tsx
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuthLogin } from "@/hooks/useAuth";
import { useAppDispatch } from "@/store/hook";
import { setAuth } from "@/store/authSlice";

const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

interface Props {
  onSuccessRedirect?: string;
}

export const LoginPage: React.FC<Props> = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const { mutateAsync: authLogin } = useAuthLogin();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const userData: any = await authLogin(values);

        const data = {
          token: userData.data.token,
          user: userData.data.user,
        };

        localStorage.setItem("token", data.token);
        // Store token and user in redux
        dispatch(
          setAuth({ token: userData.data.token, user: userData.data.user })
        );

        toast.success("Logged in successfully!");
        navigate("/listings");
      } catch (error: any) {
        toast.error(error.message || "Login failed");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="space-y-4 w-full max-w-md mx-auto">
      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          name="email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter your email"
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-sm text-destructive">{formik.errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Password</Label>
        <Input
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter your password"
        />
        {formik.touched.password && formik.errors.password && (
          <p className="text-sm text-destructive">{formik.errors.password}</p>
        )}
      </div>

      <Button
        type="button"
        onClick={() => formik.handleSubmit()}
        disabled={loading}
        className="w-full h-12 bg-primary text-white rounded-xl"
      >
        {loading ? "Logging in..." : "Sign In"}
      </Button>
    </div>
  );
};
