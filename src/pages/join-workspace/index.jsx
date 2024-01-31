/* eslint-disable no-comments/disallowComments */
/*  eslint-disable react/no-unescaped-entities */
import Button from 'components/button';
import React, { useEffect, useState } from 'react';

import style from './join.module.scss';
import { useToaster } from 'hooks/use-toaster';
import { Link } from 'react-router-dom';
import { useAcceptInvite } from 'hooks/api-hooks/auth.hook';
import Loader from 'components/loader';

const JoinWorkspace = () => {
  const { toastSuccess, toastError } = useToaster();
  const [newUser, setNewUser] = useState(false);

  // NOTE: Get the full URL
  const fullURL = window.location.href;

  // NOTE: Parse the URL and extract query parameters
  const url = new URL(fullURL);
  const otp = url.searchParams.get('otp');
  const ws = url.searchParams.get('ws');
  const email = url.searchParams.get('email');

  const { mutateAsync: _acceptInviteHandler, isLoading: _isSubmitting } = useAcceptInvite();
  const acceptHandler = async () => {
    const formData = {
      otp: otp,
      workspace: ws,
      email: email,
    };
    try {
      const res = await _acceptInviteHandler({ ...formData });
      toastSuccess(res?.data?.msg);
    } catch (error) {
      toastError(error);
      if (error?.status === 404) {
        setNewUser(true);
      }
    }
  };

  useEffect(() => {
    acceptHandler();
  }, []);

  return (
    <>
      {_isSubmitting ? (
        <Loader />
      ) : (
        <div className={style.main}>
          {newUser && <span>You're not a member yet, Please sign up. 😶</span>}
          {!newUser && <span>Workspace joined!🎉</span>}
          {newUser && (
            <Link to={`/sign-up?otp=${otp}?ws=${ws}?newEmail=${email}`}>
              <Button text={'Go to Sign up'} />
            </Link>
          )}
          {!newUser && (
            <Link to={`/dashboard`}>
              <Button text={'Go to Dashboard'} />
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default JoinWorkspace;
