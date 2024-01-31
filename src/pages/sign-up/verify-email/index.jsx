import { useForm } from 'react-hook-form';

import Button from 'components/button';

import crosscheckLogo from 'assets/cross-check-logo.svg';
import style from './verify.module.scss';
import Code from 'components/confirmation-code';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useActivate, useResendOtp } from 'hooks/api-hooks/auth.hook';
import { useToaster } from 'hooks/use-toaster';
import { useAuthContext } from 'context/auth.context';
import { useEffect, useState } from 'react';

const VerifySignUpEmail = () => {
  const { handleSubmit, setError, control } = useForm();
  const { email } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const active = searchParams.get('active');
  const [isResendDisabled, setIsResendDisabled] = useState(active ? false : true);
  const [secondsLeft, setSecondsLeft] = useState(300);

  // NOTE: Get the query string from the URL
  const queryString = window.location.search;

  // NOTE: Split the query string by ampersand (&)
  const queryParams = queryString.substr(1).split('?');

  // NOTE: Initialize variables to store the values
  let otp = null;
  let ws = null;
  let newEmail = null;
  let signUpType = null;

  // NOTE: Iterate over the query parameters and parse them
  queryParams.forEach((param) => {
    const [key, value] = param.split('=');
    if (key === 'otp') {
      otp = value;
    } else if (key === 'ws') {
      ws = value;
    } else if (key === 'signUpType') {
      signUpType = value;
    } else if (key === 'newEmail') {
      newEmail = value;
    }
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(secondsLeft - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  useEffect(() => {
    if (secondsLeft === 0) {
      setIsResendDisabled(false);
    }
  }, [secondsLeft]);

  const formatCountdown = (seconds) => {
    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    const formattedMinutes = minutes.toString().padStart(2, '0');

    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const { mutateAsync: _activateAccountHandler, isLoading: isSubmitting } = useActivate();
  const { mutateAsync: _resendOtpHandler } = useResendOtp();
  const { setAuthToken } = useAuthContext();

  const { toastSuccess, toastError } = useToaster();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        email: email || email,
        otp: data?.otp,
      };
      const res = await _activateAccountHandler({
        ...formData,
      });
      localStorage.setItem('accessToken', JSON.stringify(res?.headers?.authorization));
      setAuthToken(res?.headers?.authorization);
      toastSuccess(res?.data?.msg, { autoClose: 500 });
      if (res?.status === 200 && signUpType === 'AppAndExtension') {
        navigate(otp ? `/login?otp=${otp}?ws=${ws}?newEmail=${newEmail}` : `/welcome/${email}`);
      } else if (res?.status === 200 && signUpType === 'Extension') {
        navigate(`/login`);
      }
    } catch (error) {
      toastError(error, setError);
    }
  };

  const resendOtp = async () => {
    try {
      const formData = {
        email: email || email,
      };
      const res = await _resendOtpHandler({
        ...formData,
      });

      toastSuccess(res.msg);
      setSearchParams({});
      setIsResendDisabled(true);
      setSecondsLeft(300);
    } catch (error) {
      toastError(error, setError);
    }
  };

  return (
    <>
      <div className={style.navbar}>
        <img src={crosscheckLogo} alt="" />
        <Link to="/login">
          <Button text="Login" btnClass={style.btn} />
        </Link>
      </div>
      <div className={style.main}>
        <div className={style.card}>
          <h2>Verify your email</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <p className={style.enter}>Please enter the code we emailed you.</p>
            <p className={style.emailText}>{email}</p>
            <Code label="Confirmation Code" name={'otp'} control={control} />
            <div>
              {secondsLeft > 0 ? (
                <p className={style.otp}>
                  OTP will be expired in <span>{formatCountdown(secondsLeft)}</span>
                </p>
              ) : (
                <p className={style.otp}>Time Expired</p>
              )}
            </div>
            <Button text={'Verify'} disabled={isSubmitting} btnClass={style.loginBtn} />

            <div className={style.smallBtn}>
              <Link to="/login">
                <Button text="Login" type={'button'} btnClass={style.btn} />
              </Link>
            </div>
            <div className={style.logIn}>
              <p>Didn’t receive a code?</p>

              <span
                className={style.btnText}
                style={{
                  cursor: isResendDisabled ? 'not-allowed' : 'pointer',
                  color: isResendDisabled ? '#7d7d7d' : '',
                }}
                onClick={isResendDisabled ? null : resendOtp}
              >
                Resend Code
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default VerifySignUpEmail;
