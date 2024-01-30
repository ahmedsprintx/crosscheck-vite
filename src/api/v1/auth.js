import client from 'api/axios-config';

export function login(body) {
  return client.post(`/api/auth/login`, body);
}
export function logout() {
  return client.post(`/api/auth/logout`);
}
export function signup(body) {
  return client.post(`/api/auth/sign-up`, body);
}
export function resendOtp(body) {
  return client.post(`/api/auth/resend-otp`, body);
}
export function activateAccount(body) {
  return client.post(`/api/auth/activate-account`, body);
}
export function onBoarding(body) {
  return client.post(`/api/auth/onboarding`, body);
}
export function forgotPassword(body) {
  return client.post(`/api/users/forgot-password`, body);
}
export function resetPassword(body) {
  return client.post(`/api/users/set-new-password`, body);
}
export function acceptInvite(body) {
  return client.post(`/api/users/accept-invite`, body);
}

export function rejectInvite(body) {
  return client.post(`/api/users/reject-invite`, body);
}
