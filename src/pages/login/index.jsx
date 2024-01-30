import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import TextField from 'components/text-field';
import _ from 'lodash';

import crosscheckLogo from 'assets/cross-check-logo.svg';
import style from './login.module.scss';
import Button from 'components/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAcceptInvite, useLogin } from 'hooks/api-hooks/auth.hook';
import { useAuthContext } from 'context/auth.context';
import { useToaster } from 'hooks/use-toaster';
import { emailValidate } from 'utils/validations';
import { useAppContext } from 'context/app.context';
import Checkbox from 'components/checkbox';

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  // NOTE: Get the query string from the URL
  const queryString = window.location.search;

  // NOTE: Split the query string by ampersand (&)
  const queryParams = queryString.substr(1).split('?');

  // NOTE: Initialize variables to store the values
  let otp = null;
  let ws = null;
  let newEmail = null;

  // NOTE: Iterate over the query parameters and parse them
  queryParams.forEach((param) => {
    const [key, value] = param.split('=');
    if (key === 'otp') {
      otp = value;
    } else if (key === 'ws') {
      ws = value;
    } else if (key === 'newEmail') {
      newEmail = value;
    }
  });

  const { mutateAsync: _acceptInviteHandler, isLoading: _isSubmitting } = useAcceptInvite();

  const acceptHandler = async () => {
    const formData = {
      otp: otp,
      workspace: ws,
      email: newEmail,
    };
    try {
      const res = await _acceptInviteHandler({ ...formData });
      toastSuccess(res?.msg);
    } catch (error) {
      toastError(error);
    }
  };

  useEffect(() => {
    if (otp) {
      acceptHandler();
    }
  }, []);

  const { mutateAsync: _loginHandler, isLoading: isSubmitting } = useLogin();
  const { setAuthToken } = useAuthContext();

  const { setUserDetails } = useAppContext();
  const { toastSuccess, toastError } = useToaster();
  const navigate = useNavigate();

  const [password, setPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const res = await _loginHandler({
        ...data,
      });
      setAuthToken(res?.headers.authorization);
      if (otp) {
        localStorage.setItem('user', JSON.stringify({ ...res?.data.data, lastAccessedWorkspace: ws }));
      } else {
        localStorage.setItem('user', JSON.stringify(res?.data.data));
      }
      setUserDetails(res?.data.data);
      if (res.status === 200) {
        res && res?.data.data?.signUpType === 'AppAndExtension'
          ? (window.location.href = otp ? `/dashboard?otp=${otp}?ws=${ws}?newEmail=${newEmail}` : '/dashboard')
          : navigate(`/captures`);
      }
    } catch (error) {
      if (error.msg === 'Inactive account!') {
        navigate(`/verify-email/${data.email}?active=true`);
      } else {
        toastError(error, setError);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={style.navbar}>
        <img src={crosscheckLogo} alt="" />

        <Link to="/sign-up">
          <Button text="Sign up" disabled={isSubmitting} type={'button'} btnClass={style.btn} />
        </Link>
      </div>
      <div className={style.main}>
        <div className={style.inner}>
          <div className={style.flex1}>
            <h6>Welcome back!</h6>
            <p> Enter your credentials to log into your account </p>
            <TextField
              label="Email"
              register={() =>
                register('email', {
                  required: 'Required',
                  validate: emailValidate,
                })
              }
              placeholder="email@address.com"
              name="email"
              type="email"
              wraperClass={style.label}
              errorMessage={errors.email && errors.email.message}
              data-cy="login-form-email-input"
            />
            <TextField
              label="Password"
              register={() => register('password', { required: 'Required' })}
              placeholder="Enter you password"
              name="password"
              type={password ? 'text' : 'password'}
              wraperClass={style.label}
              errorMessage={errors.password && errors.password.message}
              data-cy="login-form-password-input"
            />
            <div
              style={{
                marginTop: '10px',
              }}
            >
              <Checkbox
                label={'Show Password'}
                onLabelClick={() => setPassword((prev) => !prev)}
                containerClass={style.checkboxContainer}
              />
            </div>
            <Link to="/forgot-password">
              <p className={style.p}>Forgot Password?</p>
            </Link>
            <Button text="Login" disabled={isSubmitting} btnClass={style.loginBtn} data-cy="login-form-btn" />
            <div className={style.smallBtn}>
              <Link to="/sign-up">
                <Button text="Sign up" disabled={isSubmitting} type={'button'} btnClass={style.btn} />
              </Link>
            </div>
          </div>
          <h1 className={style.h1}>
            Don’t have an account?
            <Link to="/sign-up">
              <span>Sign up</span>
            </Link>
          </h1>
        </div>
      </div>
    </form>
  );
};

export default Login;
