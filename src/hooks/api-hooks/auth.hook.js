// NOTE: third party
import { useMutation } from 'react-query';

// NOTE: hook's or api's
import {
  acceptInvite,
  activateAccount,
  forgotPassword,
  login,
  logout,
  onBoarding,
  rejectInvite,
  resendOtp,
  resetPassword,
  signup,
} from 'api/v1/auth';

export const useLogin = () => {
  return useMutation(login);
};
export const useLogout = () => {
  return useMutation(logout);
};
export const useSignup = () => {
  return useMutation(signup);
};
export const useResendOtp = () => {
  return useMutation(resendOtp);
};
export const useActivate = () => {
  return useMutation(activateAccount);
};
export const useOnboarding = () => {
  return useMutation(onBoarding);
};
export const useForgotPassword = () => {
  return useMutation(forgotPassword);
};
export const useResetPassword = () => {
  return useMutation(resetPassword);
};
export const useAcceptInvite = () => {
  return useMutation(acceptInvite);
};
export const useRejectInvite = () => {
  return useMutation(rejectInvite);
};
