import MainWrapper from 'components/layout/main-wrapper';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { formattedDate } from 'utils/date-handler';

import clickup from 'assets/clickup.svg';
import jira from 'assets/Jira.svg';
import github from 'assets/github.svg';
import oneDrive from 'assets/One Drive.svg';
import googleDrive from 'assets/google-drive.svg';
import teams from 'assets/microsoft-team.svg';
import googleCalender from 'assets/google-calendar.svg';
import reconnect from 'assets/reconnect.svg';

import style from './integration.module.scss';

import Button from 'components/button';
import {
  useConnectClickUp,
  useConnectGoogleDrive,
  useConnectJira,
  useConnectOneDrive,
  useGetMyWorkspaces,
  useGetUserById,
} from 'hooks/api-hooks/settings/user-management.hook';
import { useAppContext } from 'context/app.context';
import { useForm } from 'react-hook-form';
import { useToaster } from 'hooks/use-toaster';
import _ from 'lodash';
import { useLocation } from 'react-router-dom';
import { envObject } from 'constants/environmental';
const IntegrationPage = () => {
  const { toastSuccess, toastError } = useToaster();
  const { setError } = useForm();
  const location = useLocation();
  const [codeValue, setCodeValue] = useState(null);
  const { userDetails } = useAppContext();
  const [integrationMode, setIntegrationMode] = useState('');
  const {
    CLICKUP_CLIENT_ID,
    CLICKUP_REDIRECT_URI,
    JIRA_CLIENT_ID,
    JIRA_REDIRECT_URI,
    GOOGLE_CLIENT_ID,
    GOOGLE_REDIRECT_URI,
    ONE_REDIRECT_URI,
    ONE_CLIENT_ID,
  } = envObject;

  useEffect(() => {
    const queryString = location?.search;
    const queryParams = queryString?.substring(1).split('&');

    queryParams.forEach((param) => {
      const [key, value] = param?.split('=');
      if (key === 'code') {
        setCodeValue(value);
      }
      // NOTE: if url contains "state" that means its jira integration url
      if (key === 'state') {
        setIntegrationMode('jira');
      }
      // NOTE: if url contains "session_state" that means its one Drive integration url
      if (key === 'session_state') {
        setIntegrationMode('OneDrive');
      }
      // NOTE: if url contains "scope" and drive.file in this scope that means its Google drive integration url
      if (key === 'scope' && value.includes('drive.file')) {
        setIntegrationMode('GoogleDrive');
      }
    });
  }, [location.search]);

  const signUpMode = userDetails?.signUpType;

  const { data: _getAllWorkspaces } = useGetMyWorkspaces(signUpMode);
  const { data: _userDataById, refetch, isLoading: _isLoading } = useGetUserById(userDetails?.id);

  const currentWS = _userDataById?.user?.workspaces?.find(
    (workspace) => workspace?.workSpaceId === _userDataById?.user?.lastAccessedUserWorkspace,
  );

  const matchingWorkspace =
    _getAllWorkspaces?.workspaces?.length > 0 &&
    _getAllWorkspaces?.workspaces?.find((workspaces) => workspaces?.workSpaceId === userDetails?.lastAccessedWorkspace);

  // NOTE: connect Clickup
  const { mutateAsync: _createConnectClickUp, isLoading: isConnecting } = useConnectClickUp();
  const connectionHandler = async (code) => {
    try {
      const res = await _createConnectClickUp({ code });
      toastSuccess(res.msg);
      // NOTE: setIntegrationMode('');
      refetch();
    } catch (error) {
      toastError(error, setError);
    }
  };
  useEffect(() => {
    if (
      codeValue &&
      integrationMode !== 'jira' &&
      integrationMode !== 'GoogleDrive' &&
      integrationMode !== 'OneDrive'
    ) {
      connectionHandler(codeValue);
    }
  }, [codeValue]);

  // NOTE: connect Jira
  const { mutateAsync: _createConnectJira, isLoading: isConnectingJira } = useConnectJira();
  const jiraConnectionHandler = async (code) => {
    try {
      const res = await _createConnectJira({ code });
      toastSuccess(res.msg);
      setIntegrationMode('');
      refetch();
    } catch (error) {
      toastError(error, setError);
    }
  };
  useEffect(() => {
    if (codeValue && integrationMode === 'jira') {
      jiraConnectionHandler(codeValue);
    }
  }, [codeValue]);

  // NOTE: connect GoogleDrive
  const { mutateAsync: _createConnectGoogleDrive } = useConnectGoogleDrive();
  const googleDriveConnectionHandler = async (code) => {
    try {
      const res = await _createConnectGoogleDrive({ code });
      toastSuccess(res.msg);
      setIntegrationMode('');
      refetch();
    } catch (error) {
      toastError(error, setError);
    }
  };

  useEffect(() => {
    if (codeValue && integrationMode === 'GoogleDrive') {
      googleDriveConnectionHandler(decodeURIComponent(codeValue));
    }
  }, [codeValue]);

  // NOTE: connect OneDrive
  const { mutateAsync: _createConnectOneDrive, isLoading: isConnectingOneDrive } = useConnectOneDrive();
  const oneDriveConnectionHandler = async (code) => {
    try {
      const res = await _createConnectOneDrive({ code });
      toastSuccess(res.msg);
      setIntegrationMode('');
      refetch();
    } catch (error) {
      toastError(error, setError);
    }
  };
  useEffect(() => {
    if (codeValue && integrationMode === 'OneDrive') {
      oneDriveConnectionHandler(codeValue);
    }
  }, [codeValue]);

  const handleClickUpConnect = () => {
    const url = `https://app.clickup.com/api?client_id=${CLICKUP_CLIENT_ID}&redirect_uri=${CLICKUP_REDIRECT_URI}`;
    window.open(url, '_blank');
  };
  const handleJiraConnect = () => {
    const url = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${JIRA_CLIENT_ID}&scope=offline_access%20read%3Ajira-work%20manage%3Ajira-project%20read%3Ajira-user%20write%3Ajira-work%20manage%3Ajira-webhook%20manage%3Ajira-data-provider%20manage%3Ajira-configuration&redirect_uri=${JIRA_REDIRECT_URI}&state=\${YOUR_USER_BOUND_VALUE}&response_type=code&prompt=consent`;
    window.open(url, '_blank');
  };
  const handleGoogleDriveConnect = () => {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata&access_type=offline&include_granted_scopes=true&response_type=code&state=state_parameter_passthrough_value&redirect_uri=${GOOGLE_REDIRECT_URI}&client_id=${GOOGLE_CLIENT_ID}`;
    window.open(url, '_blank');
  };
  const handleOneDriveConnect = () => {
    const url = `https://login.microsoftonline.com/common/oauth2/authorize?response_type=code&client_id=${ONE_CLIENT_ID}&redirect_uri=${ONE_REDIRECT_URI}`;
    window.open(url, '_blank');
  };

  return (
    <MainWrapper title="Integrations" date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}>
      <div className={style.grid}>
        <div className={style.box}>
          <div className={style.flexDiv}>
            <div className={style.iconSide}>
              <img src={clickup} />
              <p>Clickup</p>
            </div>
            <div className={style.btnSide}>
              <Button
                text={currentWS?.clickUpUserId ? 'connected' : 'connect'}
                btnClass={currentWS?.clickUpUserId ? style.btnClassConnected : style.btnClass}
                handleClick={() => {
                  handleClickUpConnect();
                }}
                disabled={currentWS?.clickUpUserId}
              />
              {currentWS?.clickUpUserId && (
                <span className={style.clickupId}>
                  <img src={reconnect} onClick={() => handleClickUpConnect()} />({currentWS?.clickUpUserId})
                </span>
              )}
            </div>
          </div>
          <span className={style.lowerText}>Create tasks for failed test cases and bug</span>
        </div>
        <div className={style.box}>
          <div className={style.flexDiv}>
            <div className={style.iconSide}>
              <img src={jira} />
              <p>Jira</p>
            </div>
            <div className={style.btnSide}>
              <Button
                text={currentWS?.jiraUserId ? 'connected' : 'connect'}
                btnClass={currentWS?.jiraUserId ? style.btnClassConnected : style.btnClass}
                handleClick={() => {
                  handleJiraConnect();
                }}
              />
              {currentWS?.jiraUserId && (
                <span className={style.clickupId}>
                  <img src={reconnect} onClick={() => handleJiraConnect()} />({currentWS?.jiraUserId})
                </span>
              )}
            </div>
          </div>
          <span className={style.lowerText}>Create tasks for bugs or failed test cases</span>
        </div>
        <div className={style.box}>
          <div className={style.flexDiv}>
            <div className={style.iconSide}>
              <img src={oneDrive} />
              <p>One Drive</p>
            </div>
            {matchingWorkspace?.oneDriveAccessToken && (
              <img
                src={reconnect}
                onClick={() => userDetails?.superAdmin && handleOneDriveConnect()}
                className={style.reconnectIcon}
              />
            )}
            <div className={style.btnSide}>
              <Button
                text={matchingWorkspace?.oneDriveAccessToken ? 'connected' : 'connect'}
                btnClass={matchingWorkspace?.oneDriveAccessToken ? style.btnClassConnected : style.btnClass}
                disabled={userDetails?.superAdmin && !matchingWorkspace?.oneDriveAccessToken ? false : true}
                handleClick={() => {
                  userDetails?.superAdmin && !matchingWorkspace?.oneDriveAccessToken ? handleOneDriveConnect() : '';
                }}
              />
              {!userDetails?.superAdmin && <div className={style.tooltip}>only owner can integrate one drive</div>}
            </div>
          </div>
          <span className={style.lowerText}>Data backup to your Microsoft one drive</span>
        </div>
        <div className={style.box}>
          <div className={style.flexDiv}>
            <div className={style.iconSide}>
              <img src={googleDrive} />
              <p>Google Drive</p>
            </div>
            {matchingWorkspace?.googleDriveAccessToken && (
              <img
                src={reconnect}
                onClick={() => userDetails?.superAdmin && handleGoogleDriveConnect()}
                className={style.reconnectIcon}
              />
            )}
            <div className={style.btnSide}>
              <Button
                text={matchingWorkspace?.googleDriveAccessToken ? 'connected' : 'connect'}
                btnClass={matchingWorkspace?.googleDriveAccessToken ? style.btnClassConnected : style.btnClass}
                disabled={userDetails?.superAdmin && !matchingWorkspace?.googleDriveAccessToken ? false : true}
                handleClick={() => {
                  userDetails?.superAdmin && !matchingWorkspace?.googleDriveAccessToken
                    ? handleGoogleDriveConnect()
                    : '';
                }}
              />
              {!userDetails?.superAdmin && <div className={style.tooltip}>only owner can integrate google drive</div>}
            </div>
          </div>
          <span className={style.lowerText}>Data backup to your personal google drive</span>
        </div>
        <div className={style.box}>
          <div className={style.flexDiv}>
            <div className={style.iconSide}>
              <img src={github} />
              <p>Github</p>
            </div>
            <div className={style.btnSide}>
              <Button text={'upcoming'} btnClass={style.btnClassUpcoming} />
            </div>
          </div>
          <span className={style.lowerText}>Update with latest version of test enviroment</span>
        </div>
        <div className={style.box}>
          <div className={style.flexDiv}>
            <div className={style.iconSide}>
              <img src={teams} />
              <p>Teams</p>
            </div>
            <div className={style.btnSide}>
              <Button text={'upcoming'} btnClass={style.btnClassUpcoming} />
            </div>
          </div>
          <span className={style.lowerText}>Notifications and alerts on Microsoft teams</span>
        </div>
        <div className={style.box}>
          <div className={style.flexDiv}>
            <div className={style.iconSide}>
              <img src={googleCalender} />
              <p>Google Calendar</p>
            </div>
            <div className={style.btnSide}>
              <Button text={'upcoming'} btnClass={style.btnClassUpcoming} />
            </div>
          </div>
          <span className={style.lowerText}>Test Runs events on google calendar </span>
        </div>
      </div>
    </MainWrapper>
  );
};

export default IntegrationPage;
