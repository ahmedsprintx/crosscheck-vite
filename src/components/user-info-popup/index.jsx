import React, { useState } from 'react';

import avatar from 'assets/avatar.svg';
import MailIcon from 'components/icon-component/mail-icon';
import CopyIcon from 'components/icon-component/copy-icon';
import TickIcon from 'components/icon-component/tick';

import style from './userinfo.module.scss';
import ActivityIcon from 'components/icon-component/activity-icon';
import { useToaster } from 'hooks/use-toaster';

const UserInfoPopup = ({ data, isLoading }) => {
  const { toastSuccess } = useToaster();
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (text) => {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
  };

  const handleCopyEmail = () => {
    const email = data?.user?.email;
    if (email) {
      copyToClipboard(email);
      toastSuccess('Email copied to clipboard');
      setIsCopied(true);
    }
  };
  return (
    <div className={style.main}>
      <div className={style.profileDiv}>
        <img src={data?.user?.profilePicture || avatar} height={60} width={60} alt="" />
        <span className={style.statusOnline}>Online</span>
      </div>
      <div>
        <span className={style.title}>{data?.user?.name}</span>
      </div>
      <div className={style.email} style={{ position: 'relative' }}>
        <MailIcon />
        <span>{data?.user?.email}</span>
        <div className={style.copyDiv} onClick={handleCopyEmail}>
          {!isCopied ? <CopyIcon /> : <TickIcon />}
        </div>
        <p className={style.copyText}>{isCopied && 'copied'}</p>
      </div>
      <div className={style.email}>
        <ActivityIcon />
        <span>{data?.user?.lastActive}</span>
      </div>
    </div>
  );
};

export default UserInfoPopup;
