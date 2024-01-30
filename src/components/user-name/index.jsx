import React from 'react';
import { useState, useEffect } from 'react';

import UserInfoPopup from 'components/user-info-popup';

import { useGetUserById } from 'hooks/api-hooks/settings/user-management.hook';
import { useToaster } from 'hooks/use-toaster';

import style from './user-name.module.scss';
import Highlighter from 'components/highlighter';

const UserName = ({ user, id, isHovering, searchedText }) => {
  const { toastError, toastSuccess } = useToaster();

  const { data: _userDataById, isLoading: _isLoadingUser } = useGetUserById(isHovering);

  const getUserDetail = async (id) => {
    try {
      const res = await _userDataById(id);
    } catch (error) {
      toastError(error);
    }
  };

  useEffect(() => {
    if (isHovering) {
      getUserDetail(isHovering);
    }
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <Highlighter search={searchedText}>{user?.name ? user?.name : '-'}</Highlighter>
      <div style={{ position: 'absolute', zIndex: '1000' }}>
        {isHovering && <UserInfoPopup data={_userDataById} isLoading={_isLoadingUser} />}
      </div>
    </div>
  );
};

export default UserName;
