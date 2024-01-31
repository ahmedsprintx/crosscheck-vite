import { useState } from 'react';

import crosscheckLogo from 'assets/cross-check-logo.svg';

import style from './sign.module.scss';
import Button from 'components/button';
import TextField from 'components/text-field';
import { useForm } from 'react-hook-form';
import icon1 from 'assets/sign-extension.png';
import icon2 from 'assets/sign-app.png';
import Checkbox from 'components/checkbox';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useToaster } from 'hooks/use-toaster';
import { useSignup } from 'hooks/api-hooks/auth.hook';
import { emailValidate } from 'utils/validations';

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm();

  const [password, setPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const { toastSuccess, toastError } = useToaster();
  const navigate = useNavigate();
  const location = useLocation();
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const prefilledEmail = location?.search?.slice(1);
  const [signUpType, setSignUpType] = useState('AppAndExtension');

  const handleOptionClick = (option) => {
    setSignUpType(option);
  };
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

  const { mutateAsync: _signupHandler, isLoading: isSubmitting } = useSignup();

  const onSubmit = async (data) => {
    try {
      const res = await _signupHandler({
        ...data,
        signUpType: signUpType,
        timeZone: userTimeZone,
      });
      toastSuccess(res.msg, { autoClose: 500 });
      if (res.emailSent) {
        navigate(
          otp
            ? `/verify-email/${data.email}?otp=${otp}?ws=${ws}?newEmail=${newEmail}signUpType=${signUpType}`
            : `/verify-email/${data.email}?signUpType=${signUpType}`,
        );
      }
    } catch (error) {
      toastError(error, setError);
    }
  };

  const validatePasswords = () => {
    const password = watch('password');
    const confirmPassword = watch('confirmPassword');
    return password === confirmPassword || "Passwords don't match";
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={style.navbar}>
          <img src={crosscheckLogo} alt="" />
          <Link to="/login">
            <Button text="Login" type={'button'} btnClass={style.btn} />
          </Link>
        </div>
        <div className={style.main}>
          <div className={style.card}>
            <h2>Let’s Start</h2>
            <div className={style.inner}>
              <div
                className={`${style.moreInner} ${signUpType === 'Extension' && style.selected}`}
                onClick={() => handleOptionClick('Extension')}
              >
                <img src={icon1} alt="extension-icon" />
                <span>Cross Check Extension</span>
              </div>
              <div
                className={`${style.moreInner} ${signUpType === 'AppAndExtension' && style.selected}`}
                onClick={() => handleOptionClick('AppAndExtension')}
              >
                <img src={icon2} alt="app-icon" />
                <span>Cross Check App</span>
              </div>
            </div>
            <TextField
              label="Name"
              register={() =>
                register('name', {
                  required: 'Required',
                })
              }
              placeholder="John Doe"
              name="name"
              type="text"
              wraperClass={style.label}
              errorMessage={errors?.name?.message}
              data-cy="signup-form-name-input"
            />
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
              errorMessage={errors?.email?.message}
              defaultValue={prefilledEmail || ''}
              data-cy="signup-form-email-input"
            />
            <TextField
              label="Password"
              register={() => register('password', { required: 'Required' })}
              placeholder={'Create a Strong Password'}
              name="password"
              type={password ? 'text' : 'password'}
              wraperClass={style.label}
              errorMessage={errors?.password?.message}
              data-cy="signup-form-password-input"
            />
            <TextField
              label="Confirm Password"
              register={() => register('confirmPassword', { required: 'Required', validate: validatePasswords })}
              placeholder={'Create a Strong Password'}
              name="confirmPassword"
              type={password ? 'text' : 'password'}
              wraperClass={style.label}
              errorMessage={errors?.confirmPassword?.message}
              data-cy="signup-form-confirm-password-input"
            />

            <div className={style.checkbox}>
              <Checkbox
                label={'Show Password'}
                containerClass={style.checkboxClass}
                handleChange={() => setPassword((prev) => !prev)}
                dataCy="signup-form-checkbox-input"
              />
            </div>
            <div className={`${style.checkbox} ${style.checkbox1}`}>
              <Checkbox
                containerClass={style.checkboxClass}
                handleChange={() => setAgreed(!agreed)}
                dataCy="signup-form-termsconditions-checkbox"
              />
              <h6>
                By Continuing, you agree to our
                <span>Terms & Conditions</span> and <span>Privacy Policy</span>
              </h6>
            </div>

            <Button
              text={'Sign up'}
              disabled={isSubmitting || !agreed}
              btnClass={style.loginBtn}
              data-cy="signup-form-btn-input"
            />
            <div className={style.smallBtn}>
              <Link to="/login">
                <Button text="Login" disabled={isSubmitting} type={'button'} btnClass={style.btn} />
              </Link>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default SignUp;
