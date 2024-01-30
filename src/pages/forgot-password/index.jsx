import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import TextField from 'components/text-field';

import crosscheckLogo from 'assets/cross-check-logo.svg';

import arrow from 'assets/arrow-ticket.svg';
import style from './login.module.scss';
import Button from 'components/button';
import { toast } from 'react-toastify';
import axios from '../../utils/axios.js';
import { emailValidate } from 'utils/validations';
import { useForgotPassword } from 'hooks/api-hooks/auth.hook';
import { useToaster } from 'hooks/use-toaster';

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const { mutateAsync: _forgotPasswordHandler } = useForgotPassword();

  const { toastSuccess, toastError } = useToaster();

  const sendEmail = async (data) => {
    try {
      const res = await _forgotPasswordHandler(data);
      if (res.emailSent) {
        toastSuccess(res.msg);
        navigate('/login');
      }
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <>
      <div className={style.navbar}>
        <img src={crosscheckLogo} alt="" />

        <Link to="/sign-up">
          <Button text="Sign up" type={'button'} btnClass={style.btn} />
        </Link>
      </div>
      <div className={style.main}>
        <div className={style.inner}>
          <div className={style.flex1}>
            <Link to="/login">
              <div className={style.innerFlex}>
                <img src={arrow} alt="" />
                <p>Back to Login </p>
              </div>
            </Link>
            <h6>Reset Password</h6>
            <p>Enter email and we’ll send you a link to reset password</p>
            <form onSubmit={handleSubmit(sendEmail)}>
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
              />

              <Button text="Send Link" type={'submit'} btnClass={style.loginBtn} />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
