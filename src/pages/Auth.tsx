import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import OnboardingLayout from "@/components/layouts/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthLogin } from "@/hooks/useAuth";
import { setAuth } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hook";
import { ErrorMessage, Form, Formik, useFormikContext } from "formik";
import React from "react";
import { IoLogoGoogle } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as Yup from "yup";

const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { mutateAsync: authLogin } = useAuthLogin();
  const dispatch = useAppDispatch();
  // useEffect(() => {
  //   // Redirect to tenant auth as default
  //   navigate("/auth/tenant", { replace: true });
  // }, [navigate]);

  return (
    <OnboardingLayout>
      <div className="max-w-md w-full mx-auto">
        <div className=" flex flex-col mb-8 ">
          <h2 className="text-3xl font-semibold pb-2 font-plus-jakarta-sans text-gray-900">
            Login to your account
          </h2>
          <p className="text-slate-500 font-inter text-sm">
            Enter your email below to login to your account
          </p>
        </div>

        <Formik
          validationSchema={loginValidationSchema}
          initialValues={{
            email: "thernloven16578@outlook.com",
            password: "password123",
          }}
          onSubmit={async (values) => {
            try {
              const userData: any = await authLogin(values);

              const data = {
                token: userData.data.token,
                user: userData.data.user,
              };

              console.log(userData.data, "userData.data.");
              localStorage.setItem("token", data.token);
              // Store token and user in redux
              dispatch(setAuth({ token: data.token, user: data.user }));

              toast.success("Logged in successfully!");
              navigate("/listings");
            } catch (error: any) {
              toast.error(error.message || "Login failed");
            }
          }}
        >
          {() => (
            <Form>
              <LoginForm />
            </Form>
          )}
        </Formik>

        <div className="text-center text-xs font-inter text-gray-500">
          Don't have an account? &nbsp;
          <Link
            to="/onboarding"
            className="text-orange-500 font-medium hover:underline cursor-pointer"
          >
            Sign up
          </Link>
        </div>

        <div className="mt-8 text-xs font-inter text-gray-500 text-center">
          By creating an account, you agree to the <br />
          <span className="underline">Terms of Service</span> and{" "}
          <span className="underline">Privacy Policy</span>
        </div>
      </div>
    </OnboardingLayout>
  );
};

const LoginForm = () => {
  const formik = useFormikContext();
  return (
    <>
      <div className="w-full space-y-4">
        <div className="font-inter">
          <label className="block text-sm font-inter font-normal text-black mb-2">
            Email
          </label>
          <Input
            type="email"
            placeholder="Your email address"
            {...formik.getFieldProps("email")}
            className={`w-full ${
              formik.touched.email && formik.errors.email
                ? "border-red-500"
                : ""
            }`}
          />

          <ErrorMessage
            component={"p"}
            name="email"
            className="text-red-500 text-sm mt-1"
          />
        </div>

        <div className="">
          <label className="block text-sm font-normal font-inter text-black mb-2">
            Password
          </label>
          <Input
            type="password"
            placeholder="Your password"
            {...formik.getFieldProps("password")}
            className={`w-full ${
              formik.touched.password && formik.errors.password
                ? "border-red-500"
                : ""
            }`}
          />

          <ErrorMessage
            component={"p"}
            name="password"
            className="text-red-500 text-sm mt-1"
          />
        </div>

        <Button
          onClick={() => formik.handleSubmit()}
          disabled={formik.isSubmitting}
          className="w-full bg-accent  text-white font-semibold py-2 mb-4"
        >
          Continue
        </Button>
      </div>
      <div className="text-center text-xs text-gray-500 my-4">OR</div>

      <Button variant="outline" className="w-full mb-6 ">
        <IoLogoGoogle />
        Continue with Google
      </Button>
    </>
  );
};
export default Auth;
