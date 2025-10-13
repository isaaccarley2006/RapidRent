import { fetcher } from "@/lib/fetcher";
import { useMutation } from "@tanstack/react-query";

type AuthLoginType = { email: string; password: string };
type AuthOtpResendType = { email: string };
type AuthOtpVerifyType = { email: string; code: string };
type AuthRegisterAuth = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAgency: boolean;
};

export const useAuthLogin = () => {
  return useMutation({
    mutationFn: (data: AuthLoginType) =>
      fetcher({
        url: "/api/auth/login",
        method: "POST",
        bodyData: data,
      }),
  });
};

export const useAuthVerifyEmail = () => {
  return useMutation({
    mutationFn: (data: AuthOtpVerifyType) =>
      fetcher({
        url: "/api/auth/verify-email",
        method: "POST",
        bodyData: data,
      }),
  });
};

export const useAuthResendOtp = () => {
  return useMutation({
    mutationFn: (data: AuthOtpResendType) =>
      fetcher({
        url: "/api/auth/resend-code",
        method: "POST",
        bodyData: data,
      }),
  });
};

export const useAuthRegister = () => {
  return useMutation({
    mutationFn: (data: AuthRegisterAuth) =>
      fetcher({
        url: "/api/auth/register",
        method: "POST",
        bodyData: data,
      }),
  });
};

// Agency Auth

// export const useAuthCreateAgencyProfile = () => {
//   return useMutation({
//     mutationFn: (data: AuthRegisterAuth) =>
//       fetcher({
//         url: "/api/auth/resend-code",
//         method: "POST",
//         bodyData: data,
//       }),
//   });
// };
