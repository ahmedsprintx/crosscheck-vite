import React, { useState } from 'react';
import style from './more.module.scss';
import SelectBox from 'components/select-box';
import { useForm } from 'react-hook-form';

import _ from 'lodash';
import Button from 'components/button';
import Input from 'components/text-field';
import Row from 'components/members-row';
import {
  useAddMembers,
  useDeleteMembers,
  useGetProjectById,
  useUpdateProject,
} from 'hooks/api-hooks/projects/projects.hook';
import { useParams } from 'react-router-dom';

import { statusOptions, useUsersOptions } from 'utils/drop-down-options';
import { formattedDate } from 'utils/date-handler';
import { useToaster } from 'hooks/use-toaster';
import { useAppContext } from 'context/app.context';
import Permissions from 'components/permissions';
import TextField from 'components/text-field';
import CrossIcon from 'components/icon-component/cross';
import TickIcon from 'components/icon-component/tick';
import EditIconGrey from 'components/icon-component/edit-icon-grey';
import Loader from 'components/loader';

const More = () => {
  const { id } = useParams();

  const { data: _projectDetails, refetch, isLoading: _isLoading } = useGetProjectById(id);

  const { toastSuccess, toastError } = useToaster();

  const { usersOptions } = useUsersOptions();

  const {
    control,
    formState: { errors },
    setError,
    register,
    reset,
    watch,
    trigger,
  } = useForm();
  const [showAllProfiles, setShowAllProfiles] = useState(false);
  const [edit, setEdit] = useState(false);
  const [edit2, setEdit2] = useState(false);
  const [edit3, setEdit3] = useState(false);
  const { userDetails } = useAppContext();
  const { mutateAsync: _updateProjectHandler, isLoading: _updatingProject } = useUpdateProject();
  const updateProject = async (type) => {
    try {
      const res = await _updateProjectHandler({
        id,
        body: {
          ..._projectDetails,
          name: edit ? watch('name') : _projectDetails.name,
          status: edit2 ? watch('status') : _projectDetails.status,
          idSeries: edit3 ? watch('idSeries') : _projectDetails.idSeries,
          shareWith: _projectDetails?.shareWith?.map((x) => x._id),
        },
      });
      toastSuccess(res.msg);
      refetch();
      type === 'name' && setEdit(false);
      type === 'status' && setEdit2(false);
      type === 'idSeries' && setEdit3(false);
    } catch (error) {
      toastError(error, setError);
    }
  };

  const { mutateAsync: _addMemberHandler, isLoading: _addingMember } = useAddMembers();

  const addMember = async () => {
    try {
      if (watch('shareWith') && !_.isEmpty(watch('shareWith'))) {
        const res = await _addMemberHandler({
          id,
          body: { shareWith: watch('shareWith') },
        });
        toastSuccess(res.msg);
        reset();
        refetch();
      }
    } catch (error) {
      toastError(error, setError);
    }
  };

  const { mutateAsync: _removeMemberHandler, isLoading: _removingMember } = useDeleteMembers();

  const removeMember = async (memberID) => {
    try {
      const res = await _removeMemberHandler({
        id,
        body: { memberToDelete: memberID },
      });
      toastSuccess(res.msg);
      refetch();
    } catch (error) {
      toastError(error, setError);
    }
  };

  const handleViewAllClick = () => {
    setShowAllProfiles(!showAllProfiles);
  };

  const visibleProfiles = showAllProfiles
    ? _projectDetails?.shareWith
    : _projectDetails?.shareWith.slice(0, 5);

  return (
    <>
      {_isLoading ? (
        <Loader />
      ) : (
        <>
          <div className={style.wrapper}>
            <div className={style.headings}>
              <div className={style.dataDetails}>
                <div className={style.headingsDiv}>Project Name</div>
                <div className={style.content}>
                  {edit ? (
                    <div className={style.editMode}>
                      <Input
                        className={style.inputClass}
                        register={() =>
                          register('name', {
                            required: 'Required',
                          })
                        }
                        defaultValue={_projectDetails?.name}
                        name="name"
                        placeholder="Project Name"
                        errorMessage={errors.name && errors.name.message}
                      />
                      <div className={style.saveBtn}>
                        <div
                          style={{
                            height: '14px',
                            width: '14px',
                          }}
                          onClick={() => setEdit(false)}
                        >
                          <CrossIcon />
                        </div>

                        <div
                          style={{
                            height: '14px',
                            width: '14px',
                          }}
                          onClick={() => !_updatingProject && updateProject('name')}
                        >
                          <TickIcon />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={style.contentDiv} style={{ display: 'flex', gap: '10px' }}>
                      {_projectDetails?.name}
                      <Permissions
                        allowedRoles={['Admin', 'Project Manager']}
                        currentRole={userDetails.role}
                      >
                        <div onClick={() => setEdit(true)}>
                          <EditIconGrey />
                        </div>
                      </Permissions>
                    </div>
                  )}
                </div>
              </div>
              <div className={style.dataDetails}>
                <div className={style.headingsDiv}>Project Status</div>
                <div className={style.content}>
                  {edit2 ? (
                    <div className={style.editMode}>
                      <SelectBox
                        name="status"
                        control={control}
                        rules={{
                          required: 'Required',
                        }}
                        badge
                        defaultValue={_projectDetails?.status || ''}
                        options={statusOptions}
                        label={'Project Status'}
                        placeholder={'Status'}
                        numberBadgeColor={'#39695b'}
                        showNumber
                        errorMessage={errors.status && errors.status.message}
                        dynamicWrapper={style.dynamicWrapper}
                      />

                      <div className={style.saveBtn}>
                        <div
                          style={{
                            height: '14px',
                            width: '14px',
                          }}
                          onClick={() => setEdit2(false)}
                        >
                          <CrossIcon />
                        </div>

                        <div
                          style={{
                            height: '14px',
                            width: '14px',
                          }}
                          onClick={() => !_updatingProject && updateProject('status')}
                        >
                          <TickIcon />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={style.contentDiv} style={{ display: 'flex', gap: '10px' }}>
                      {_projectDetails?.status}
                      <Permissions
                        allowedRoles={['Admin', 'Project Manager']}
                        currentRole={userDetails.role}
                      >
                        <div onClick={() => setEdit2(true)}>
                          <EditIconGrey />
                        </div>
                      </Permissions>
                    </div>
                  )}
                </div>
              </div>
              <div className={style.dataDetails}>
                <div className={style.headingsDiv}>ID Series</div>
                <div className={style.content}>
                  {edit3 ? (
                    <div
                      className={style.editMode}
                      style={{
                        position: 'relative',
                      }}
                    >
                      <div
                        className={style.count}
                        style={{ marginTop: errors.idSeries && '-65px' }}
                      >
                        {watch('idSeries') ? watch('idSeries')?.length || 3 : 0}/3
                      </div>
                      <TextField
                        className={style.inputClass}
                        register={() =>
                          register('idSeries', {
                            required: 'Required',
                            pattern: {
                              value: /^[A-Z]{3}$/,
                              message: 'IdSeries must be three uppercase alphabets (A-Z)',
                            },
                          })
                        }
                        defaultValue={_projectDetails?.idSeries}
                        name="idSeries"
                        placeholder="Id Series"
                        maxLength={3}
                        errorMessage={errors.idSeries && errors.idSeries.message}
                      />
                      <div className={style.saveBtn}>
                        <div
                          style={{
                            height: '14px',
                            width: '14px',
                          }}
                          onClick={() => setEdit3(false)}
                        >
                          <CrossIcon />
                        </div>
                        <div
                          style={{
                            height: '14px',
                            width: '14px',
                          }}
                          onClick={() => !_updatingProject && updateProject('idSeries')}
                        >
                          <TickIcon />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={style.contentDiv} style={{ display: 'flex', gap: '10px' }}>
                      {_projectDetails?.idSeries}
                      <Permissions
                        allowedRoles={['Admin', 'Project Manager']}
                        currentRole={userDetails.role}
                      >
                        <div onClick={() => setEdit3(true)}>
                          <EditIconGrey />
                        </div>
                      </Permissions>
                    </div>
                  )}
                </div>
              </div>
              <div className={style.dataDetails}>
                <div className={style.headingsDiv}>Created By</div>
                <div className={style.contentDiv}>
                  {`${_projectDetails?.createdBy?.name || ''} (${
                    _projectDetails?.createdBy?.email || ''
                  })`}
                </div>
              </div>
              <div className={style.dataDetails}>
                <div className={style.headingsDiv}>Created At</div>
                <div className={style.contentDiv}>
                  {formattedDate(_projectDetails?.createdAt, "dd MMM, yyyy 'at' hh:mm a")}
                </div>
              </div>
              <div className={`${style.dataDetails} ${style.lastDataDetails}`}>
                <div className={style.headingsDiv}>Members</div>
                <div className={style.contentLast}>
                  <div className={style.contentLast}>
                    <Permissions
                      allowedRoles={['Admin', 'Project Manager', 'QA']}
                      currentRole={userDetails?.role}
                    >
                      <div className={style.selectDiv}>
                        <SelectBox
                          dynamicWrapper={style.noLabel}
                          name="shareWith"
                          control={control}
                          rules={{
                            required: 'Required',
                          }}
                          badge
                          options={
                            usersOptions?.filter((x, index) => {
                              return !_projectDetails?.shareWith.some(
                                (profile) => profile._id === x.value,
                              );
                            }) || []
                          }
                          label={'Share with'}
                          isMulti
                          placeholder={'Select'}
                          numberBadgeColor={'#39695b'}
                          showNumber
                          errorMessage={errors.shareWith && errors.shareWith.message}
                        />

                        <Button
                          className={style.btnClass}
                          text={'Add Member'}
                          onClick={addMember}
                          disabled={_addingMember}
                          btnClass={style.buttonClass}
                        />
                      </div>
                    </Permissions>
                    <div className={style.rowContainer}>
                      {visibleProfiles?.map((profile, index) => (
                        <Row
                          role={userDetails?.role}
                          data={profile}
                          handleClick={() => removeMember(profile?._id)}
                        />
                      ))}
                    </div>
                    {!showAllProfiles && _projectDetails?.shareWith?.length > 5 && (
                      <div className={style.viewAll}>
                        <p style={{ cursor: 'pointer' }} onClick={handleViewAllClick}>
                          View All
                        </p>
                      </div>
                    )}
                    {showAllProfiles && (
                      <div className={style.viewAll}>
                        <p style={{ cursor: 'pointer' }} onClick={handleViewAllClick}>
                          See Less
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={style.wrapperMobile}>
            <div className={style.headings}>
              <div
                className={style.headingsDiv}
                style={{ marginBottom: edit && edit2 ? '15px' : '' }}
              >
                Project Name
              </div>
              {edit ? (
                <div
                  className={style.editMode}
                  style={{ marginBottom: edit && edit2 ? '15px' : '' }}
                >
                  <Input
                    className={style.inputClass}
                    register={() =>
                      register('projectName', {
                        required: 'Required',
                      })
                    }
                    defaultValue={_projectDetails?.name}
                    name="projectName"
                    placeholder="Project Name"
                    errorMessage={errors.name && errors.name.message}
                  />
                  <div className={style.saveBtn}>
                    <div
                      style={{
                        height: '12px',
                        width: '16.8px',
                      }}
                      onClick={() => setEdit(false)}
                    >
                      <CrossIcon />
                    </div>

                    <div
                      style={{
                        height: '18px',
                        width: '16.8px',
                      }}
                      onClick={() => updateProject('name')}
                    >
                      <TickIcon />
                    </div>
                  </div>
                </div>
              ) : (
                <div className={style.contentDiv} style={{ display: 'flex', gap: '10px' }}>
                  {_projectDetails?.name}
                  <div onClick={() => setEdit(true)}>
                    <EditIconGrey />
                  </div>
                </div>
              )}
              <div className={style.headingsDiv}>Project Status</div>
              {edit2 ? (
                <div className={style.editMode}>
                  <SelectBox
                    name="status"
                    control={control}
                    rules={{
                      required: 'Required',
                    }}
                    badge
                    defaultValue={_projectDetails?.status || ''}
                    options={statusOptions}
                    label={'Project Status'}
                    placeholder={'Status'}
                    numberBadgeColor={'#39695b'}
                    showNumber
                    errorMessage={errors.status && errors.status.message}
                    dynamicWrapper={style.dynamicWrapper}
                  />

                  <div className={style.saveBtn}>
                    <div
                      style={{
                        height: '12px',
                        width: '16.8px',
                      }}
                      onClick={() => setEdit2(false)}
                    >
                      <CrossIcon />
                    </div>

                    <div
                      style={{
                        height: '18px',
                        width: '16.8px',
                      }}
                      onClick={() => updateProject('status')}
                    >
                      <TickIcon />
                    </div>
                  </div>
                </div>
              ) : (
                <div className={style.contentDiv} style={{ display: 'flex', gap: '10px' }}>
                  {_projectDetails?.status}

                  <div onClick={() => setEdit2(true)}>
                    <EditIconGrey />
                  </div>
                </div>
              )}
              <div className={style.headingsDiv}>ID Series</div>
              {edit3 ? (
                <div
                  className={style.editMode}
                  style={{
                    marginBottom: edit && edit2 ? '15px' : '',
                    position: 'relative',
                  }}
                >
                  <div className={style.count} style={{ marginTop: errors.idSeries && '-65px' }}>
                    {watch('idSeries') ? watch('idSeries')?.length || 3 : 0}/3
                  </div>
                  <TextField
                    className={style.inputClass}
                    register={() =>
                      register('idSeries', {
                        required: 'Required',
                        pattern: {
                          value: /^[A-Z]{3}$/,
                          message: 'IdSeries must be three uppercase alphabets (A-Z)',
                        },
                      })
                    }
                    defaultValue={_projectDetails?.idSeries}
                    name="idSeries"
                    placeholder="Id Series"
                    maxLength={3}
                    errorMessage={errors.idSeries && errors.idSeries.message}
                  />
                  <div className={style.saveBtn}>
                    <div
                      style={{
                        height: '12px',
                        width: '16.8px',
                      }}
                      onClick={() => setEdit3(false)}
                    >
                      <CrossIcon />
                    </div>
                    <div
                      style={{
                        height: '18px',
                        width: '16.8px',
                      }}
                      onClick={() => updateProject('idSeries')}
                    >
                      <TickIcon />
                    </div>
                  </div>
                </div>
              ) : (
                <div className={style.contentDiv} style={{ display: 'flex', gap: '10px' }}>
                  {_projectDetails?.idSeries}

                  <div onClick={() => setEdit3(true)}>
                    <EditIconGrey />
                  </div>
                </div>
              )}
              <div className={style.headingsDiv}>Created By</div>
              <div className={style.contentDiv}>
                {`${_projectDetails?.createdBy?.name || ''} (${
                  _projectDetails?.createdBy?.email || ''
                })`}
              </div>
              <div className={style.headingsDiv}>Created At</div>
              <div className={style.contentDiv}>
                {formattedDate(_projectDetails?.createdAt, "dd MMM, yyyy 'at' hh:mm a")}
              </div>
              <div className={style.headingsDiv}>Members</div>
            </div>
          </div>
          <div className={style.contentLastMobile}>
            <Permissions
              allowedRoles={['Admin', 'Project Manager', 'QA']}
              currentRole={userDetails?.role}
            >
              <div className={style.selectDiv}>
                <SelectBox
                  dynamicWrapper={style.noLabel}
                  name="shareWith"
                  control={control}
                  rules={{
                    required: 'Required',
                  }}
                  badge
                  options={
                    usersOptions?.filter((x, index) => {
                      return !_projectDetails?.shareWith.some((profile) => profile._id === x.value);
                    }) || []
                  }
                  label={'Share with'}
                  isMulti
                  placeholder={'Select'}
                  numberBadgeColor={'#39695b'}
                  showNumber
                  errorMessage={errors.shareWith && errors.shareWith.message}
                />

                <Button
                  className={style.btnClass}
                  text={'Add Member'}
                  onClick={addMember}
                  disabled={_addingMember}
                  btnClass={style.buttonClass}
                />
              </div>
            </Permissions>
            {_removingMember ? (
              <Loader />
            ) : (
              <div className={style.rowContainer}>
                {visibleProfiles?.map((profile, index) => (
                  <div className={style.membersRow}>
                    <div className={style.imgDiv}>
                      {profile?.profilePicture ? (
                        <img src={profile?.profilePicture} alt="" height={35} width={35} />
                      ) : (
                        <span
                          className={style.initialSpan}
                          style={{ height: '35px', width: '35px' }}
                        >
                          {_.first(profile?.name)}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <p className={style.name}>{profile?.name}</p>
                      <p>{profile?.email}</p>
                    </div>
                    <Permissions
                      allowedRoles={['Admin', 'Project Manager', 'QA']}
                      currentRole={userDetails?.role}
                    >
                      <Button
                        text={'Remove'}
                        btnClass={style.btnRemove}
                        handleClick={() => removeMember(profile?._id)}
                      />
                    </Permissions>
                  </div>
                ))}
              </div>
            )}
            {!showAllProfiles && _projectDetails?.shareWith?.length > 5 && (
              <div className={style.viewAll}>
                <p style={{ cursor: 'pointer' }} onClick={handleViewAllClick}>
                  View All
                </p>
              </div>
            )}
            {showAllProfiles && (
              <div className={style.viewAll}>
                <p style={{ cursor: 'pointer' }} onClick={handleViewAllClick}>
                  See Less
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default More;
