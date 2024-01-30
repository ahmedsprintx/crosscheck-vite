import React, { useEffect, useState } from 'react';

import Modal from 'components/modal';
import Button from 'components/button';

import style from './task-modal.module.scss';
import CrossIcon from 'components/icon-component/cross';
import clickup from 'assets/clickup.svg';
import jira from 'assets/Jira.svg';
import ClickUpTask from './clickup';
import JiraTask from './jira';
import { useNavigate } from 'react-router-dom';
import { useRefreshToken } from 'hooks/api-hooks/task/task.hook';
import { useToaster } from 'hooks/use-toaster';
import { useGetUserById } from 'hooks/api-hooks/settings/user-management.hook';
import { useAppContext } from 'context/app.context';
import { useProjectOptions } from './helper';
import ClickUpSvg from 'components/icon-component/click-up';
import JiraIcon from 'components/icon-component/jira-icon';

const CreateTaskModal = ({
  bugsData,
  testCaseData,
  projectId,
  setSelectedBugs,
  selectedRecords,
  backClass,
  openDelModal,
  isSubmitting,
  setOpenDelModal,
  submitHandlerTask,
  submitHandlerJiraTask,
  isJiraSubmitting,
  setSelectedRecords,
}) => {
  const navigate = useNavigate();
  const [taskType, setTaskType] = useState('');
  const { userDetails } = useAppContext();
  const { toastError } = useToaster();
  const [next, setNext] = useState('');
  const { data = {} } = useProjectOptions();
  const { assignedTo = [], priorityOptions = [] } = data;

  const { data: _userDataById, refetch, isLoading: _isLoading } = useGetUserById(userDetails?.id);
  const currentWS = _userDataById?.user?.workspaces?.find(
    (workspace) => workspace?.workSpaceId === _userDataById?.user?.lastAccessedUserWorkspace,
  );

  const { mutateAsync: _RefreshToken, isLoading: _isRefreshing } = useRefreshToken();
  const refreshJiraToken = async () => {
    try {
      const response = await _RefreshToken();
    } catch (error) {
      toastError(error);
    }
  };
  useEffect(() => {
    if (openDelModal && currentWS?.jiraUserId) {
      refreshJiraToken();
    }
  }, [openDelModal, currentWS?.jiraUserId]);

  const keyNameMappingTestCase = {
    testCaseId: 'Test Case ID',
    testObjective: 'Test Objective',
    preConditions: 'Precondition',
    testSteps: 'Test Steps',
    status: 'Test Case Status',
    expectedResults: 'Expected Results',
  };

  const keysToDisplayTestCase = [
    'testCaseId',
    'testObjective',
    'preConditions',
    'status',
    'testSteps',
    'expectedResults',
  ];

  // NOTE: Extract the data you want to display in the textarea
  const prefillTextTestCase =
    testCaseData?.length > 0 &&
    testCaseData
      ?.map((selectedObject) => {
        return keysToDisplayTestCase
          .map((key) => {
            if (
              key === 'testObjective' ||
              key === 'testSteps' ||
              key === 'expectedResults' ||
              key === 'preConditions'
            ) {
              const description = selectedObject[key]?.description || '';
              const descriptionObj = JSON.parse(description);
              const descriptionText = descriptionObj?.blocks
                ?.map((block) => block.text) // NOTE: Extract all lines
                .join('\n'); // NOTE: Join lines with "\n"
              return `${keyNameMappingTestCase[key]}: ${descriptionText}`;
            } else {
              return `${keyNameMappingTestCase[key]}: ${selectedObject[key]}`;
            }
          })
          .filter(Boolean) // NOTE: Remove empty lines
          .join('\n');
      })
      .filter(Boolean) // NOTE: Remove empty sections
      .join('\n -------------------------- \n');

  const keyNameMapping = {
    bugId: 'Bug ID',
    severity: 'Severity',
    status: 'Status',
    feedback: 'Feedback',
    reproduceSteps: 'Reproduce Steps',
    idealBehaviour: 'Ideal Behaviour',
    testedVersion: 'Tested Version',
    testEvidence: 'Test Evidence',
    reportedBy: 'Reported By',
  };

  const keysToDisplay = [
    'bugId',
    'severity',
    'status',
    'feedback',
    'reproduceSteps',
    'idealBehaviour',
    'testedVersion',
    'testEvidence',
    'reportedBy',
  ];
  // NOTE: Extract the data you want to display in the textarea
  const prefillText =
    bugsData?.length > 0 &&
    bugsData
      ?.map((selectedObject) => {
        return keysToDisplay
          .map((key) => {
            if (key === 'feedback' || key === 'reproduceSteps' || key === 'idealBehaviour') {
              const description = selectedObject[key]?.description || '';
              const descriptionObj = JSON.parse(description);
              const descriptionText = descriptionObj?.blocks?.map((block) => block.text).join('\n');
              return `${keyNameMapping[key]}: ${descriptionText !== undefined ? descriptionText : ''}`;
            } else if (key === 'reportedBy') {
              const name = selectedObject[key]?.name || '';
              return `${keyNameMapping[key]}: ${name !== undefined ? name : ''}`;
            } else {
              const value = selectedObject[key];
              return `${keyNameMapping[key]}: ${value !== undefined ? value : ''}`;
            }
          })
          .join('\n');
      })
      .join('\n -------------------------- \n');

  const [textareaValue, setTextareaValue] = useState(bugsData ? prefillText : prefillTextTestCase);

  const handleTextareaChange = (e) => {
    setTextareaValue(e?.target?.value);
  };

  return (
    <Modal
      open={openDelModal}
      handleClose={() => {
        setOpenDelModal(false);
        setSelectedBugs([]);
        setSelectedRecords([]);
        setTextareaValue('');
      }}
      className={style.mainDiv}
      // NOTE: backClass={backClass}
    >
      {next === '' && (
        <div className={style.innerWrapper}>
          <div>
            <div className={style.header}>
              <span>Create Task</span>
              <div
                onClick={() => {
                  setOpenDelModal(false);
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
            <span className={style.desc}>Choose application where you want to create task.</span>
            <div className={style.flexButtons}>
              {currentWS?.clickUpUserId && (
                <div
                  className={style.box}
                  style={{ borderColor: taskType === 'clickup' ? '#2151fd' : '' }}
                  onClick={() => setTaskType('clickup')}
                >
                  <div className={style.flexDiv}>
                    <div className={style.iconSide}>
                      <ClickUpSvg />
                      <p>Clickup</p>
                    </div>
                  </div>
                </div>
              )}
              {currentWS?.jiraUserId && (
                <div
                  className={style.box}
                  style={{ borderColor: taskType === 'jira' ? '#2151fd' : '' }}
                  onClick={() => setTaskType('jira')}
                >
                  <div className={style.flexDiv}>
                    <div className={style.iconSide}>
                      <JiraIcon />
                      <p>Jira</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <span className={style.linkText} onClick={() => navigate('/integrations')}>
              Go to <span>Integrations</span> page, to find out more integrations.
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              justifyContent: 'end',
            }}
          >
            <Button
              text={'Discard'}
              type={'button'}
              btnClass={style.btnClassUncheckModal}
              handleClick={() => {
                setOpenDelModal(false);
                setSelectedBugs([]);
                setTextareaValue('');
                setSelectedRecords([]);
              }}
            />
            <Button
              text={'Next'}
              disabled={_isRefreshing}
              handleClick={() => {
                setNext(taskType);
              }}
            />
          </div>
        </div>
      )}{' '}
      {/* task menu */}
      {next === 'clickup' && (
        <ClickUpTask
          assignedTo={assignedTo}
          priorityOptions={priorityOptions}
          bugsData={bugsData}
          testCaseData={testCaseData}
          projectId={projectId}
          setSelectedBugs={setSelectedBugs}
          selectedRecords={selectedRecords}
          backClass={backClass}
          openDelModal={openDelModal}
          setTextareaValue={setTextareaValue}
          isSubmitting={isSubmitting}
          setOpenDelModal={setOpenDelModal}
          prefillText={prefillText}
          prefillTextTestCase={prefillTextTestCase}
          submitHandlerTask={submitHandlerTask}
          setSelectedRecords={setSelectedRecords}
          handleTextareaChange={handleTextareaChange}
        />
      )}
      {next === 'jira' && (
        <JiraTask
          assignedTo={assignedTo}
          priorityOptions={priorityOptions}
          taskType={taskType}
          bugsData={bugsData}
          testCaseData={testCaseData}
          projectId={projectId}
          setSelectedBugs={setSelectedBugs}
          selectedRecords={selectedRecords}
          setTextareaValue={setTextareaValue}
          isSubmitting={isSubmitting}
          setOpenDelModal={setOpenDelModal}
          prefillText={prefillText}
          prefillTextTestCase={prefillTextTestCase}
          submitHandlerJiraTask={submitHandlerJiraTask}
          setSelectedRecords={setSelectedRecords}
          handleTextareaChange={handleTextareaChange}
          isJiraSubmitting={isJiraSubmitting}
        />
      )}
    </Modal>
  );
};

export default CreateTaskModal;
