import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErrorMessage, Form, Formik, useFormikContext } from "formik";
import React from "react";
import { IoLogoGoogle } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

const Auth: React.FC = () => {
  const navigate = useNavigate();

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

        <Formik initialValues={{}} onSubmit={() => {}}>
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
            className={`w-full  ${
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
          className="w-full bg-accent  text-white font-semibold py-2 rounded-xl mb-4"
        >
          Continue
        </Button>
      </div>
      <div className="text-center text-xs text-gray-500 my-4">OR</div>

      <Button
        variant="outline"
        className="w-full  bg-slate-100 text-black hover:bg-slate-200 hover:text-black border-none font-semibold rounded-xl py-2  mb-6 "
      >
        <IoLogoGoogle />
        Continue with Google
      </Button>
    </>
  );
};
export default Auth;
