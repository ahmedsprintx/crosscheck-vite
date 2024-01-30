import React, { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import _ from 'lodash';

import { formattedDate } from 'utils/date-handler';
import { useToaster } from 'hooks/use-toaster';
import { useMode } from 'context/dark-mode';
import { timeZones } from 'utils/time-zone';
import { useAppContext } from 'context/app.context';
import { useGetUserById, useUpdateAccount } from 'hooks/api-hooks/settings/user-management.hook';
import { handleFile } from 'utils/file-handler';

import Button from 'components/button';
import Switch from 'components/switch';
import Loader from 'components/loader';
import TextField from 'components/text-field';
import SelectBox from 'components/select-box';
import MainWrapper from 'components/layout/main-wrapper';

import style from './account-settings.module.scss';

const AccountSetting = () => {
  const { setError, register, setValue, watch, handleSubmit, control } = useForm();
  const { mutateAsync: _updateAccountHandler, isLoading } = useUpdateAccount();
  const { userDetails, updateUserDetails, setUserDetails } = useAppContext();
  const { toastSuccess, toastError } = useToaster();
  const fileInputRef = useRef(null);
  const [isFormDirty, setIsFormDirty] = useState(false);

  const handleInputChange = () => {
    setIsFormDirty(true);
  };
  const openFileInput = () => {
    fileInputRef?.current?.click();
  };
  const fileUpload = async (event, allowedType, name) => {
    const base64 = await handleFile(event, allowedType);
    setValue(name, base64);
  };
  const logoutUser = () => {
    localStorage.removeItem('accessToken');
    window.location.reload();
  };
  const { data: _userDataById, refetch, isLoading: _isLoading } = useGetUserById(userDetails?.id);

  React.useEffect(() => {
    if (_userDataById?.user && Object.keys(_userDataById?.user).length) {
      let values = _.pick(_userDataById?.user, [
        'name',
        'email',
        'profilePicture',
        'clickUpUserId',
        'timeZone',
      ]);
      values = {
        ...values,
      };

      updateUserDetails((pre) => ({
        ...pre,
        name: values?.name,
        email: values?.email,
        ...(values?.profilePicture && {
          profilePicture: values?.profilePicture,
        }),
      }));
      localStorage.setItem(
        'user',
        JSON.stringify({
          ...userDetails,
          name: values?.name,
          email: values?.email,
          ...(values?.profilePicture && {
            profilePicture: values?.profilePicture,
          }),
        }),
      );
      Object.entries(values).forEach(([key, val]) => {
        setValue(key, val);
      });
    }
  }, [_userDataById?.user]);

  const addEditUserHandler = async (data) => {
    const formData = {
      name: data.name,
      email: data.email,
      timeZone: data.timeZone,
    };

    if (watch('profilePicture')) {
      formData.profilePicture = data.profilePicture;
    }
    if (watch('newPassword')) {
      formData.newPassword = data.newPassword;
    }
    if (watch('confirmPassword')) {
      formData.confirmPassword = data.confirmPassword;
    }
    try {
      const res = await _updateAccountHandler({
        body: formData,
      });
      if (res?.emailSent) {
        logoutUser();
      }
      setUserDetails({
        ...userDetails,
        profilePicture: watch('profilePicture'),
      });
      await refetch();
      toastSuccess(res.msg);
      setIsFormDirty(false);
    } catch (error) {
      toastError(error, setError);
    }
  };

  useEffect(() => {
    if (watch('timeZone')) {
      setIsFormDirty(true);
    }
  }, [watch('timeZone')]);

  const { isDarkMode, toggleMode } = useMode();

  return (
    <MainWrapper title="Account Setting" date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}>
      {isLoading ? (
        <Loader />
      ) : (
        <form onSubmit={handleSubmit(addEditUserHandler)}>
          <div className={style.wrapper}>
            <div className={style.leftSection}>
              <p>Profile Picture</p>
              <div className={style.initialContainer}>
                <label className={style.camDiv} htmlFor="file">
                  <>
                    {watch('profilePicture') ? (
                      <img src={watch('profilePicture')} alt="" />
                    ) : (
                      _userDataById?.user?.name
                        ?.split(' ')
                        ?.slice(0, 2)
                        ?.map((word) => word[0]?.toUpperCase())
                        ?.join('')
                    )}
                    <input
                      type="file"
                      id="file"
                      name="image"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        e && setIsFormDirty(true);
                        fileUpload(e, /(\.jpg|\.jpeg|\.png|\.gif)$/i, 'profilePicture');
                      }}
                    />
                  </>
                </label>
              </div>
              <Button
                text={watch('profilePicture') ? 'Remove Profile Picture' : 'Upload Profile Picture'}
                btnClass={style.btnClass}
                handleClick={() => {
                  watch('profilePicture') ? setValue('profilePicture', null) : openFileInput();
                  setIsFormDirty(true);
                }}
                type={'button'}
              />
            </div>
            <div className={style.rightSection}>
              <TextField
                onClickHandle={handleInputChange}
                label={'User Name'}
                name="name"
                register={() => register('name')}
              />
              <TextField
                onClickHandle={handleInputChange}
                label={'Email'}
                name="email"
                register={() => register('email')}
              />

              <TextField
                onClickHandle={handleInputChange}
                label={'New Password'}
                name="search"
                type={'newPassword'}
                register={() => register('newPassword')}
                placeholder="*******"
              />
              <TextField
                onClickHandle={handleInputChange}
                label={'Confirm Password'}
                name="search"
                type={'confirmPassword'}
                register={() => register('confirmPassword')}
                placeholder="*******"
              />
            </div>
          </div>
          <span className={style.titleMain}>General Settings</span>
          <SelectBox
            options={timeZones}
            label={'Time zone'}
            placeholder={'Select'}
            name={'timeZone'}
            control={control}
            numberBadgeColor={'#39695b'}
            register={() => register('timeZone')}
            dynamicClass={style.zDynamicState4}
          />
          <div className={style.toggleDiv}>
            <span>Dark Mode</span>
            <Switch
              checked={isDarkMode}
              control={control}
              name={'switch'}
              handleSwitchChange={toggleMode}
            />
          </div>

          {isFormDirty && (
            <div className={style.btnDiv}>
              <Button
                text={'Cancel'}
                btnClass={style.cancelBtn}
                type={'button'}
                handleClick={() => {
                  setIsFormDirty(false);
                }}
              />
              <Button
                text={'Save Changes'}
                btnClass={style.btnClass}
                disabled={false}
                type={'submit'}
              />
            </div>
          )}
        </form>
      )}
    </MainWrapper>
  );
};

export default AccountSetting;
