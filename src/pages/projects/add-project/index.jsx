import React from 'react';
import { useForm } from 'react-hook-form';

import _ from 'lodash';

import Modal from 'components/modal';
import TextField from 'components/text-field';
import SelectBox from 'components/select-box';
import Button from 'components/button';

import style from './modal.module.scss';
import { useGetProjectById } from 'hooks/api-hooks/projects/projects.hook';
import { generateRandomString, statusOptions } from 'utils/drop-down-options';
import { useAppContext } from 'context/app.context';
import CrossIcon from 'components/icon-component/cross';
import { useProjectOptions } from './helper';

const AddProject = ({ openAddModal, setOpenAddModal, isLoading, addProject }) => {
  const { data = {} } = useProjectOptions();
  const {
    control,
    formState: { errors },
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    reset,
  } = useForm();

  const { sharedWith = [] } = data;

  const id = typeof openAddModal === 'string' ? openAddModal : null;
  const { userDetails } = useAppContext();

  const { data: _projectData } = useGetProjectById(id);

  React.useEffect(() => {
    if (_projectData && Object.keys(_projectData).length) {
      let values = _.pick(_projectData, ['_id', 'status', 'name', 'shareWith', 'idSeries']);

      values.shareWith = values.shareWith.map((x) => x._id);

      Object.entries(values).forEach(([key, val]) => {
        setValue(key, val);
      });
    }
  }, [_projectData]);

  const onSubmit = async (data) => {
    const formData = {
      ...data,
      idSeries: id
        ? data.idSeries
        : userDetails?.activePlan === 'Free'
        ? generateRandomString()
        : data.idSeries,
      shareWith: data.shareWith ? data.shareWith : [],
    };

    const res = await addProject(id, formData, setError);
    res?.msg && setOpenAddModal(false);
  };

  return (
    <Modal
      open={!!openAddModal}
      handleClose={() => {
        setOpenAddModal(false);
        reset();
      }}
      className={style.mainDiv}
    >
      <div className={style.crossImg}>
        <span className={style.modalTitle}>{id ? 'Edit' : 'Add'} Project</span>
        <div
          data-cy="addproject-model-closeicon"
          onClick={() => {
            setOpenAddModal(false);
            reset();
          }}
          className={style.hover}
        >
          <CrossIcon />
          <div className={style.tooltip}>
            <p>Cross</p>
          </div>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          height: '340px',
          overflowY: 'auto',
        }}
      >
        <TextField
          register={() =>
            register('name', {
              required: 'Required',
            })
          }
          label="Project Name"
          name="name"
          placeholder="Project Name"
          errorMessage={errors.name && errors.name.message}
          data-cy="allproject-addproject-projectname"
        />
        <div
          style={{
            marginTop: '10px',
          }}
        >
          <SelectBox
            id={'status-SelectBox'}
            name="status"
            control={control}
            rules={{
              required: 'Required',
            }}
            badge
            options={statusOptions}
            label={'Project Status'}
            placeholder={'Status'}
            numberBadgeColor={'#39695b'}
            showNumber
            backValue={{ padding: '2px 0px' }}
            errorMessage={errors.status && errors.status.message}
          />
        </div>
        <div
          style={{
            margin: '10px 0px 30px 0px',
          }}
        >
          <SelectBox
            name="shareWith"
            control={control}
            badge
            options={
              sharedWith?.filter((x) => {
                return x.role !== 'Admin' && x.role !== 'Owner' && x.value !== userDetails?.id;
              }) || []
            }
            label={'Share with'}
            id={'sharewith-SelectBox'}
            isMulti
            placeholder={'Select'}
            numberBadgeColor={'#39695b'}
            showNumber
            errorMessage={errors.shareWith && errors.shareWith.message}
            backValue={{ padding: '2px 0px' }}
          />
          {userDetails?.activePlan !== 'Free' && (
            <div
              style={{
                margin: '10px 0px 0px 0px',
                position: 'relative',
              }}
            >
              <div className={style.count}>
                {watch('idSeries') ? watch('idSeries')?.length : 0}/3
              </div>
              <TextField
                register={() =>
                  register('idSeries', {
                    required: 'Required',
                    pattern: {
                      value: /^[A-Z]{3}$/,
                      message: 'IdSeries must be three uppercase alphabets (A-Z)',
                    },
                  })
                }
                label="ID Series"
                name="idSeries"
                placeholder="ABC"
                errorMessage={errors.idSeries && errors.idSeries.message}
                maxLength={3}
                data-cy="allproject-addproject-IDseries"
              />
            </div>
          )}
        </div>
        <div className={style.innerFlex}>
          <p
            onClick={() => {
              setOpenAddModal(false);
              reset();
            }}
          >
            Cancel
          </p>
          <Button
            text="Save"
            type={'submit'}
            disabled={isLoading}
            data-cy="allproject-addproject-save-btn"
          />
        </div>
      </form>
    </Modal>
  );
};

export default AddProject;
