import React, { useRef, useState } from 'react';
import style from './account-settings.module.scss';
import { formattedDate } from 'utils/date-handler';
import MainWrapper from 'components/layout/main-wrapper';
import TextField from 'components/text-field';
import { useForm } from 'react-hook-form';
import Button from 'components/button';
import { useToaster } from 'hooks/use-toaster';
import { useAppContext } from 'context/app.context';
import {
  useDeleteWorkspace,
  useGetMyWorkspaces,
  useUpdateWorkspace,
} from 'hooks/api-hooks/settings/user-management.hook';
import _ from 'lodash';
import { handleFile } from 'utils/file-handler';

import Loader from 'components/loader';
import DeleteModal from './delete-modal';
import SelectBox from 'components/select-box';

const WorkspaceSetting = () => {
  const { setError, register, control, setValue, watch, handleSubmit, reset } = useForm();
  const { mutateAsync: _updateWorkspaceHandler, isLoading } = useUpdateWorkspace();
  const { userDetails } = useAppContext();
  const { toastSuccess, toastError } = useToaster();
  const fileInputRef = useRef(null);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [delModal, setDelModal] = useState(false);

  const openFileInput = () => {
    fileInputRef?.current?.click();
  };
  const fileUpload = async (event, allowedType, name) => {
    const base64 = await handleFile(event, allowedType);
    setValue(name, base64);
  };
  const signUpMode = userDetails?.signUpType;

  const { data: _getAllWorkspaces, isLoading: workspacesLoading, refetch } = useGetMyWorkspaces(signUpMode);

  const matchingWorkspace =
    _getAllWorkspaces?.workspaces?.length > 0 &&
    _getAllWorkspaces?.workspaces?.find((workspaces) => workspaces?.workSpaceId === userDetails?.lastAccessedWorkspace);

  React.useEffect(() => {
    if (matchingWorkspace && Object.keys(matchingWorkspace).length) {
      let values = _.pick(matchingWorkspace, ['name', 'avatar', 'defaultStorage']);
      values = {
        ...values,
      };
      Object.entries(values).forEach(([key, val]) => {
        setValue(key, val);
      });
    }
  });

  const editWorkspaceHandler = async (data) => {
    const formData = {
      name: data.name,
      defaultStorage: data?.defaultStorage,
    };
    if (watch('avatar')) {
      formData.avatar = data.avatar;
    }
    try {
      const res = await _updateWorkspaceHandler({
        body: formData,
      });

      toastSuccess(res.msg);
      setIsFormDirty(false);
      refetch();
    } catch (error) {
      toastError(error, setError);
    }
  };

  const { mutateAsync: _deleteWorkspaceHandler } = useDeleteWorkspace();

  const handleWorkspaceDelete = async () => {
    try {
      const res = await _deleteWorkspaceHandler();
      toastSuccess(res?.msg);
    } catch (error) {
      toastError(error);
    }
    setDelModal(false);
  };

  return (
    <MainWrapper title="Workspace Setting" date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}>
      {workspacesLoading ? (
        <Loader />
      ) : (
        <>
          <form onSubmit={handleSubmit(editWorkspaceHandler)}>
            <div className={style.wrapper}>
              <div className={style.leftSection}>
                <p>Workspace Avatar</p>
                <div className={style.initialContainer}>
                  <label className={style.camDiv} htmlFor="file">
                    <>
                      {matchingWorkspace && watch('avatar') ? (
                        <img src={watch('avatar')} alt="" />
                      ) : (
                        matchingWorkspace?.name
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
                          fileUpload(e, /(\.jpg|\.jpeg|\.png|\.gif)$/i, 'avatar');
                        }}
                      />
                    </>
                  </label>
                </div>
                <Button
                  text={watch('avatar') ? 'Remove Avatar' : 'Upload Avatar'}
                  btnClass={style.btnClass}
                  handleClick={() => {
                    watch('avatar') ? setValue('avatar', null) : openFileInput();
                    setIsFormDirty(true);
                  }}
                  type={'button'}
                />
              </div>
              <div className={style.rightSection}>
                <TextField label={'Workspace Name'} name="name" register={() => register('name')} />
                <SelectBox
                  options={defaultStorageOpt}
                  label={'Default storage'}
                  name={'defaultStorage'}
                  control={control}
                  placeholder="Select"
                  numberBadgeColor={'#39695b'}
                  dynamicClass={style.zDynamicState3}
                />
              </div>
            </div>

            <div className={style.btnDiv}>
              <Button
                text={'Cancel'}
                btnClass={style.cancelBtn}
                type={'button'}
                handleClick={() => {
                  {
                    isFormDirty && reset();
                  }
                  setIsFormDirty(false);
                }}
              />
              <Button text={'Save Changes'} btnClass={style.btnClass} disabled={isLoading} type={'submit'} />
            </div>
            {userDetails?.superAdmin && (
              <div style={{ display: 'flex', justifyContent: 'end', marginTop: '10px' }}>
                <Button
                  text={'Delete Workspace'}
                  btnClass={style.delBtn}
                  type={'button'}
                  handleClick={() => {
                    setDelModal(true);
                  }}
                />
              </div>
            )}
          </form>
          <DeleteModal
            openDelModal={!!delModal}
            setOpenDelModal={() => setDelModal(false)}
            title={'Are you sure you want to delete this workspace?'}
            subtitle={'This action cannot be undone and all the data will be deleted forever'}
            removeText={'Delete'}
            cancelText={'Cancel Deletion'}
            handleUserDelete={handleWorkspaceDelete}
          />
        </>
      )}
    </MainWrapper>
  );
};

export default WorkspaceSetting;
const defaultStorageOpt = [
  { label: 'Google Drive', value: 'Google Drive' },
  { label: 'One Drive', value: 'One Drive' },
  { label: 'Default', value: 'S3' },
];
