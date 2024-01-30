import React, { useState } from 'react';

import Button from 'components/button';

import style from './jira.module.scss';
import CrossIcon from 'components/icon-component/cross';
import SelectBox from 'components/select-box';
import ArrowRight from 'components/icon-component/arrow-right';

import TextField from 'components/text-field';
import { useGetIssuesType, useGetJiraSites, useGetJiraUsers, useJiraProjects } from 'hooks/api-hooks/task/task.hook';
import { useToaster } from 'hooks/use-toaster';
import { useEffect } from 'react';
import TextArea from 'components/text-area';
import _ from 'lodash';
import { getUsers } from 'api/v1/settings/user-management';
import { useForm } from 'react-hook-form';
import Loader from 'components/loader';
import DatePicker from 'components/date-picker';
import Checkbox from 'components/checkbox';
import { formattedDate } from 'utils/date-handler';

const JiraTask = ({
  taskType,
  bugsData,
  testCaseData,
  projectId,
  setSelectedBugs,
  selectedRecords,
  assignedTo,
  priorityOptions,
  setTextareaValue,
  isJiraSubmitting,
  isSubmitting,
  setOpenDelModal,
  prefillText,
  prefillTextTestCase,
  submitHandlerJiraTask,
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

  const [selectedValue, setSelectedValue] = useState('');
  const [selectedPath, setSelectedPath] = useState({});
  const [crossCheckUsers, setCrossCheckUsers] = useState([]);
  const [jiraSites, setJiraSites] = useState([]);
  const [jiraProjects, setJiraProjects] = useState([]);
  const [issueType, setIssueType] = useState([]);
  const [jiraUsers, setJiraUsers] = useState([]);
  const { toastError } = useToaster();

  // NOTE: get jira sites
  const { mutateAsync: _sitesData, isLoading: _isFetchingSites } = useGetJiraSites();
  const fetchJiraSites = async () => {
    try {
      const response = await _sitesData();
      setJiraSites(
        response &&
          response.sites.map((x) => ({
            label: x.name,
            ...(x.avatarUrl && { image: x.avatarUrl }),
            ...(!x.avatarUrl && { imagAlt: _.first(x.name) }),
            value: { id: `${x.id}`, crossCheckUserId: x.crossCheckUserId },
          })),
      );
    } catch (error) {
      toastError(error);
    }
  };

  useEffect(() => {
    if (taskType) {
      fetchJiraSites();
    }
  }, [taskType]);

  // NOTE: get jira sites
  const { mutateAsync: _projectsData, isLoading: _isFetchingProjects } = useJiraProjects();
  const fetchJiraProjects = async (id) => {
    try {
      const response = await _projectsData(id);
      setJiraProjects(
        response.projects.map((x) => ({
          label: x.name,
          value: x.id,
        })),
      );
    } catch (error) {
      toastError(error);
    }
  };
  useEffect(() => {
    if (watch('jiraSites')) {
      fetchJiraProjects(watch('jiraSites').id);
    }
  }, [watch('jiraSites')]);

  // NOTE: get issues type
  const { mutateAsync: _getAllIssuesType, isLoading: _isLoadingIssueTypes } = useGetIssuesType();

  const fetchIssuesType = async (JiraProjectId) => {
    try {
      const response = await _getAllIssuesType({
        id: watch('jiraSites') && watch('jiraSites').id,
        projectId: JiraProjectId,
      });
      setIssueType(
        response.issueTypes.map((x) => ({
          label: x.name,
          value: x.id,
        })),
      );
    } catch (error) {
      toastError(error);
    }
  };
  useEffect(() => {
    if (watch('jiraProjectId')) {
      fetchIssuesType(watch('jiraProjectId'));
      setValue('issueTypeId', null);
    }
  }, [watch('jiraProjectId')]);

  // NOTE: get user
  const { mutateAsync: _getAllUsers, isLoading: _isLoadingUsers } = useGetJiraUsers();

  const fetchUsers = async (projectId) => {
    try {
      const response = await _getAllUsers({
        id: watch('jiraSites') && watch('jiraSites').id,
        projectId: projectId,
      });
      setJiraUsers(
        response.projectMembers.map((x) => ({
          label: x.name,
          value: { id: `${x.id}`, crossCheckUserId: x.crossCheckUserId },
        })),
      );
    } catch (error) {
      toastError(error);
    }
  };
  useEffect(() => {
    if (watch('jiraProjectId')) {
      fetchUsers(watch('jiraProjectId'));
    }
  }, [watch('jiraProjectId')]);

  // NOTE: get crosscheck users
  const fetchCrossCheckUsers = async () => {
    try {
      const response = await getUsers({
        sortBy: '',
        sort: '',
        search: '',
      });
      setCrossCheckUsers(
        response &&
          response.users.map((x) => ({
            label: x.name,
            ...(x.profilePicture && { image: x.profilePicture }),
            ...(!x.profilePicture && { imagAlt: _.first(x.name) }),
            value: x._id,
            checkbox: true,
          })),
      );
    } catch (error) {
      toastError(error);
    }
  };
  useEffect(() => {
    if (watch('issueTypeId')) {
      fetchCrossCheckUsers();
    }
  }, [watch('issueTypeId')]);

  const onSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        applicationType: 'Jira',
        summary: data.summary,
        description: data.description,
        jiraAssignee: watch('jiraAssignee') && watch('jiraAssignee').id,
        taskType: testCaseData ? 'Test Case' : 'Bug',
        crossCheckAssignee: watch('jiraAssignee').crossCheckUserId
          ? watch('jiraAssignee').crossCheckUserId
          : watch('crossCheckAssignee'),
        projectId: projectId,
        issueTypeId: watch('issueTypeId') && watch('issueTypeId'),
        jiraProjectId: watch('jiraProjectId') && watch('jiraProjectId'),
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
      submitHandlerJiraTask(watch('jiraSites').id, formData, watch('testRunChecked') && formRunData);
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
          {_isFetchingSites || _isFetchingProjects || _isLoadingUsers || _isLoadingIssueTypes ? (
            <Loader tableMode />
          ) : null}
        </div>
        <div className={style.flexDiv}>
          <SelectBox
            options={jiraSites && jiraSites}
            label={'Jira Site'}
            control={control}
            placeholder="Select"
            name={'jiraSites'}
            watch={watch}
            rules={{ required: 'Required' }}
            dynamicClass={style.selectClass}
            errorMessage={errors?.jiraSites?.message}
            disabled={jiraSites?.length > 0 ? false : true}
          />
          <SelectBox
            options={jiraProjects && jiraProjects}
            label={'Jira Project'}
            control={control}
            placeholder="Select"
            name={'jiraProjectId'}
            watch={watch}
            rules={{ required: 'Required' }}
            dynamicClass={style.selectClass}
            errorMessage={errors?.jiraProjectId?.message}
            disabled={jiraProjects?.length > 0 ? false : true}
          />
        </div>
        <SelectBox
          options={issueType && issueType}
          label={'Issue Type'}
          control={control}
          placeholder="Select"
          name={'issueTypeId'}
          watch={watch}
          rules={{ required: 'Required' }}
          dynamicClass={style.selectClass}
          errorMessage={errors?.issueTypeId?.message}
          disabled={issueType?.length > 0 ? false : true}
        />
        <div className={style.selectDiv}>
          {/* insert nestedSelectbox here */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              marginTop: '10px',
              position: 'relative',
              marginBottom: '10px',
            }}
          >
            <SelectBox
              options={jiraUsers && jiraUsers}
              label={'Jira’s Assignee'}
              control={control}
              placeholder="Select"
              name={'jiraAssignee'}
              watch={watch}
              rules={{ required: 'Required' }}
              errorMessage={errors?.jiraAssignee?.message}
              disabled={jiraUsers?.length > 0 ? false : true}
            />

            {watch('jiraAssignee')?.crossCheckUserId === null && (
              <>
                <div style={{ marginTop: '30px' }}>
                  <ArrowRight />
                </div>
                <SelectBox
                  options={crossCheckUsers && crossCheckUsers}
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
          </div>
          {watch('jiraAssignee')?.crossCheckUserId === null && (
            <div className={style.syncText}>
              <span>Sync this cross check user with Jira for future </span>
            </div>
          )}
          <TextField
            label={'Task Title / Summary'}
            name={'summary'}
            register={() => register('summary', { required: 'Required' })}
            errorMessage={errors.summary && errors.summary.message}
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
              }}
            />
            <Button text={'Create Task'} type={'submit'} disabled={isJiraSubmitting} />
          </div>
        </div>
      </div>
    </form>
  );
};

export default JiraTask;
