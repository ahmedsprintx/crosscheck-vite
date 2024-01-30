import React, { useMemo, useState } from 'react';

import Modal from 'components/modal';
import Button from 'components/button';

import style from './clickup.module.scss';
import CrossIcon from 'components/icon-component/cross';
import Checkbox from 'components/checkbox';
import SelectBox from 'components/select-box';
import ArrowRight from 'components/icon-component/arrow-right';
import TextEditor from 'components/editor/text-editor';
import HierarchicalDropdown from 'components/hierarchy-selectbox';
import TextField from 'components/text-field';
import { useGetAllMembers, useGetLocation } from 'hooks/api-hooks/task/task.hook';
import { useToaster } from 'hooks/use-toaster';
import { useEffect } from 'react';
import TextArea from 'components/text-area';
import _ from 'lodash';
import { getUsers } from 'api/v1/settings/user-management';
import { useForm } from 'react-hook-form';
import Loader from 'components/loader';
import { useProjectOptions } from '../helper';
import DatePicker from 'components/date-picker';
import { useCreateTestRun } from 'hooks/api-hooks/test-runs/test-runs.hook';
import { formattedDate } from 'utils/date-handler';

const ClickUpTask = ({
  bugsData,
  testCaseData,
  projectId,
  setSelectedBugs,
  selectedRecords,
  assignedTo,
  priorityOptions,
  backClass,
  openDelModal,
  setTextareaValue,
  isSubmitting,
  setOpenDelModal,
  prefillText,
  prefillTextTestCase,
  submitHandlerTask,
  setSelectedRecords,
  handleTextareaChange,
}) => {
  const {
    control,
    watch,
    register,
    reset,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm();

  const [locationError, setLocationError] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedPath, setSelectedPath] = useState({});
  const [location, setLocation] = useState({});
  const [crossCheckUsers, setCrossCheckUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const { toastError } = useToaster();

  // NOTE: get members data
  const { mutateAsync: _getAllMembers, isLoading: _isLoading } = useGetAllMembers();

  const fetchMembers = async (selectedValue) => {
    try {
      const response = await _getAllMembers(selectedValue);
      setMembers(
        response?.members?.map((x) => ({
          label: x.name,
          ...(x?.profilePicture && { image: x?.profilePicture }),
          ...(!x?.profilePicture && { imagAlt: _.first(x?.name) }),
          value: { id: `${x.id}`, crossCheckUserId: x.crossCheckUserId },
        })),
      );
    } catch (error) {
      toastError(error);
    }
  };
  useEffect(() => {
    if (selectedValue) {
      fetchMembers(selectedValue);
    }
  }, [selectedValue]);

  // NOTE: get locations
  const { mutateAsync: _locationData, isLoading: _isFetchingLocation } = useGetLocation();
  const fetchLocations = async () => {
    try {
      const response = await _locationData();
      setLocation(response);
    } catch (error) {
      toastError(error);
    }
  };
  useEffect(() => {
    if (openDelModal) {
      fetchLocations();
    }
  }, [openDelModal]);

  // NOTE: get crosscheck users
  const fetchCrossCheckUsers = async () => {
    try {
      const response = await getUsers({
        sortBy: '',
        sort: '',
        search: '',
      });
      setCrossCheckUsers(
        response?.users
          // NOTE: ?.filter((x) => x.role !== "Developer")
          ?.map((x) => ({
            label: x.name,
            ...(x?.profilePicture && { image: x?.profilePicture }),
            ...(!x?.profilePicture && { imagAlt: _.first(x?.name) }),
            value: x._id,
            checkbox: true,
          })),
      );
    } catch (error) {
      toastError(error);
    }
  };
  useEffect(() => {
    if (members) {
      fetchCrossCheckUsers();
    }
  }, [members]);

  const dropdwonMenuOptions = useMemo(() => {
    const input = location?.workSpaces || [];
    const addParentIds = (obj, parentId) => {
      if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
          addParentIds(obj[i], parentId);
        }
      } else if (typeof obj === 'object') {
        obj.parentId = parentId;
        for (let key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key) && Array.isArray(obj[key])) {
            addParentIds(obj[key], obj.id);
          }
        }
      }
    };
    addParentIds(input, null);
    const convertInputToOutput = (input) => {
      return input.map((item) => {
        const { id, name, spaces, parentId } = item;

        const child = spaces.map((space) => {
          const {
            id: spaceId,

            name: spaceName,

            folders,

            folderLessList,

            parentId: spaceParentId,
          } = space;

          const folderChild = folders.map((folder) => {
            const { id: folderId, name: folderName, lists, parentId: folderParentId } = folder;

            const listChild = lists.map((list) => ({
              ...list,
              parentId: folderId,
            }));

            return {
              id: folderId,
              name: folderName,
              child: listChild,
              parentId: folderParentId,
            };
          });

          const folderLessListChild = folderLessList.map((list) => ({
            ...list,
            parentId: spaceId,
          }));

          return {
            id: spaceId,

            name: spaceName,

            child: [...folderChild, ...folderLessListChild],

            parentId: spaceParentId,
          };
        });

        return { id, name, child, parentId };
      });
    };
    const output = convertInputToOutput(input);
    const convertKeysAndValues = (obj) => {
      if (obj['id']) {
        obj['key'] = obj['id'];

        delete obj['id'];
      }

      if (obj['name']) {
        obj['value'] = obj['name'];

        delete obj['name'];
      }

      if (obj['child'] && Array.isArray(obj['child'])) {
        obj['child'].forEach(convertKeysAndValues);
      }
    };
    output.forEach(convertKeysAndValues);
    return output;
  }, [location?.workSpaces]);

  const onSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        applicationType: 'ClickUp',
        name: data?.name,
        description: data?.description,
        taskType: bugsData ? 'Bug' : 'Test Case',
        teamId: watch('location')?.teamId,
        listId: watch('location')?.listId,
        clickUpAssignee: watch('clickUpAssignee')?.id,
        crossCheckAssignee: watch('clickUpAssignee')?.crossCheckUserId
          ? watch('clickUpAssignee')?.crossCheckUserId
          : watch('crossCheckAssignee'),
        projectId: projectId,
        bugIds: bugsData ? selectedRecords : [],
        testCaseIds: testCaseData ? selectedRecords : [],
      };
      const formRunData = {
        name: watch('runName') ? watch('runName') : watch('name'),
        assignee: watch('runAssignee') && watch('runAssignee'),
        priority: watch('priority') && watch('priority'),
        dueDate: formattedDate(watch('dueDate'), 'yyyy-MM-dd'),
        testCases: selectedRecords,
        projectId: projectId || watch('projectId'),
        description: JSON.stringify(watch('descriptionTestRun') && watch('descriptionTestRun')),
      };
      submitHandlerTask(formData, watch('testRunChecked') && formRunData);
    } catch (error) {
      toastError(error, setError);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={style.header}>
        <span>Create Task {watch('testRunChecked') && '& Run'}</span>
        <div
          onClick={() => {
            setOpenDelModal(false);
            reset();
            setSelectedBugs([]);
            setTextareaValue('');
            setSelectedRecords([]);
            setLocationError(false);
          }}
          className={style.hover}
        >
          <CrossIcon />
          <div className={style.tooltip}>
            <p>Close</p>
          </div>
        </div>
      </div>
      <div className={style.wrapper}>
        <div className={style.checkDiv} style={{ position: 'relative' }}>
          {_isFetchingLocation && <Loader tableMode />}
        </div>
        <div className={style.selectDiv}>
          <HierarchicalDropdown
            options={dropdwonMenuOptions}
            label={'Location'}
            name={'location'}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            setSelectedPath={setSelectedPath}
            placeholder="Select"
            setValue={setValue}
            setMembers={setMembers}
            reset
            errorMsg={locationError && !watch('location')?.teamId && 'Required'}
          />

          {/* insert nestedSelectbox here */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              marginTop: '20px',
              position: 'relative',
              marginBottom: '20px',
            }}
          >
            <SelectBox
              options={members && members}
              label={'Clickup Assignee'}
              control={control}
              placeholder="Select"
              name={'clickUpAssignee'}
              watch={watch}
              rules={{ required: 'Required' }}
              errorMessage={errors?.clickUpAssignee?.message}
              disabled={members?.length > 0 ? false : true}
            />

            {watch('clickUpAssignee')?.crossCheckUserId === null && (
              <>
                <div style={{ marginTop: '30px' }}>
                  <ArrowRight />
                </div>
                <SelectBox
                  options={crossCheckUsers}
                  label={'Cross Check Assignee'}
                  name={'crossCheckAssignee'}
                  control={control}
                  dynamicClass={style.zDynamicState4}
                  rules={{ required: 'Required' }}
                  errorMessage={errors?.crossCheckAssignee?.message}
                  placeholder="Select"
                />
              </>
            )}
            {_isLoading && <Loader tableMode />}
          </div>
          {watch('clickUpAssignee')?.crossCheckUserId === null && (
            <div className={style.syncText}>
              <span>Sync this cross check user with clickup for future </span>
            </div>
          )}
          <TextField
            label={'Task Title'}
            name={'name'}
            register={() => register('name', { required: 'Required' })}
            wraperClass={style.inputField}
            errorMessage={errors.name && errors.name.message}
          />
        </div>

        <TextArea
          label={'Task Description'}
          name={'description'}
          defaultValue={bugsData ? prefillText : prefillTextTestCase}
          onChange={handleTextareaChange}
          row={10}
          register={() => register('description')}
          errorMessage={errors?.description?.message}
        />
        {watch('testRunChecked') && (
          <div
            className={`${style.testRunSection} ${watch('testRunChecked') ? style['slide-down'] : style['slide-up']}`}
          >
            <div className={style.divider} />
            <div className={style.selectFlex}>
              <TextField
                label={'Run Title'}
                name={'runName'}
                register={() => register('runName', { required: 'Required' })}
                placeholder={'Enter Run Title'}
                errorMessage={errors?.name?.message}
                // NOTE: defaultValue={watch('name') && watch('name')}
                wraperClass={style.inputField}
                data-cy="testrun-modal-runtitle"
              />
              <SelectBox
                control={control}
                placeholder="Select"
                dynamicWrapper={style.dynamicWrapper}
                name={'runAssignee'}
                watch={watch}
                options={assignedTo}
                label={'Assignee'}
                rules={{ required: 'Required' }}
                errorMessage={errors?.runAssignee?.message}
                id="testrun-modal-assignee"
              />
            </div>
            <TextArea
              label={'Description'}
              name={'descriptionTestRun'}
              placeholder={'Write Your Text Here'}
              register={() => register('descriptionTestRun')}
              row={5}
              dataCy="testrun-modal-description"
            />
            <div className={style.selectFlex}>
              <SelectBox
                control={control}
                name={'priority'}
                label={'Priority'}
                options={priorityOptions}
                menuPlacement={'top'}
                placeholder="Select"
                rules={{ required: 'Required' }}
                errorMessage={errors?.priority?.message}
                id="testrun-modal-priority"
              />
              <div className={style.flexDate}>
                <DatePicker
                  control={control}
                  label={'Due Date'}
                  name={'dueDate'}
                  className={style.dateClass}
                  placeholder={'Select'}
                  rules={{ required: 'Required' }}
                  errorMessage={errors?.dueDate?.message}
                  id="testrun-modal-datepicker"
                />
              </div>
            </div>
          </div>
        )}

        <div className={style.btnDiv}>
          <div>
            <Checkbox
              disabledCheck={isSubmitting}
              containerClass={style.check}
              name={'testRunChecked'}
              label={'Create Test Run'}
              register={register}
              handleChange={(e) => {
                e.preventDefault();
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <Button
              text={'Discard'}
              type={'button'}
              btnClass={style.btnClassUncheckModal}
              handleClick={() => {
                setOpenDelModal(false);
                reset();
                setSelectedBugs([]);
                setTextareaValue('');
                setSelectedRecords([]);
                setLocationError(false);
              }}
            />
            <Button
              text={'Create Task'}
              type={'submit'}
              disabled={isSubmitting}
              handleClick={() => setLocationError(watch('location')?.teamId ? false : true)}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default ClickUpTask;
