import Button from 'components/button';
import React from 'react';

import style from './join.module.scss';
import { useToaster } from 'hooks/use-toaster';
import { useEffect } from 'react';
import { useRejectInvite } from 'hooks/api-hooks/auth.hook';
import { Link } from 'react-router-dom';

const RejectWorkspace = () => {
  const { toastSuccess, toastError } = useToaster();

  // NOTE: Get the full URL
  const fullURL = window.location.href;

  // NOTE: Parse the URL and extract query parameters
  const url = new URL(fullURL);
  const otp = url.searchParams.get('otp');
  const ws = url.searchParams.get('ws');
  const email = url.searchParams.get('email');

  const { mutateAsync: _rejectInviteHandler } = useRejectInvite();

  const rejectHandler = async () => {
    const formData = {
      otp: otp,
      workspace: ws,
      email: email,
    };
    try {
      const res = await _rejectInviteHandler({ ...formData });
      toastSuccess(res?.msg);
    } catch (error) {
      toastError(error);
    }
  };

  useEffect(() => {
    if (fullURL) {
      rejectHandler();
    }
  }, [fullURL]);

  return (
    <div className={style.main}>
      <span>Thankyou for your response. 😊</span>
      <Link to="/dashboard">
        <Button text="Go to QMS" />
      </Link>
    </div>
  );
};

export default RejectWorkspace;
