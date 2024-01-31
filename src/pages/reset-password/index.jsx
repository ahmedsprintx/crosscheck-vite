import { useState } from 'react';
import { useForm } from 'react-hook-form';

import TextField from 'components/text-field';

import crosscheckLogo from 'assets/cross-check-logo.svg';
import style from './login.module.scss';
import Button from 'components/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useToaster } from 'hooks/use-toaster';
import { useResetPassword } from 'hooks/api-hooks/auth.hook';
import Checkbox from 'components/checkbox';

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm();

  const location = useLocation();
  const navigate = useNavigate();

  const { toastSuccess, toastError } = useToaster();
  const { mutateAsync: _restPasswordHandler } = useResetPassword();

  const searchParams = new URLSearchParams(location.search);
  const otp = searchParams.get('otp');

  const resetPasswordHandler = async (data) => {
    try {
      if (!otp) {
        return toastError({
          msg: `Please use the link sent to your email to reset password`,
          status: 404,
        });
      }
      const res = await _restPasswordHandler({
        passwordResetOtp: otp,
        ...data,
      });
      toastSuccess(res?.msg);
      navigate('/login');
    } catch (error) {
      toastError(error, setError);
    }
  };

  const [password, setPassword] = useState(false);

  const validatePasswords = () => {
    const password = watch('password');
    const confirmPassword = watch('confirmPassword');

    return password === confirmPassword || "Passwords don't match";
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
        <form onSubmit={handleSubmit(resetPasswordHandler)}>
          <div className={style.inner}>
            <div className={style.flex1}>
              <h6>Reset Password</h6>
              <p> Create your new password </p>

              <TextField
                label="New Password"
                register={() =>
                  register('password', {
                    required: 'Required ',
                  })
                }
                placeholder="Enter you password"
                name="password"
                type={password ? 'text' : 'password'}
                wraperClass={style.label}
                errorMessage={errors.password && errors.password.message}
              />
              <TextField
                label="Confirm  Password"
                register={() =>
                  register('confirmPassword', {
                    required: 'Required ',
                    validate: validatePasswords,
                  })
                }
                placeholder="Enter you password"
                name="confirmPassword"
                type={password ? 'text' : 'password'}
                wraperClass={style.label}
                errorMessage={errors.confirmPassword && errors.confirmPassword.message}
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
              <Button text="Confirm Password" type={'submit'} btnClass={style.loginBtn} />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ResetPassword;
