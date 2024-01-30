import Loader from 'components/loader';
import { useAppContext } from 'context/app.context';
import { useGetMyWorkspaces } from 'hooks/api-hooks/settings/user-management.hook';
import React from 'react';
import { useEffect } from 'react';

const Index = () => {
  const { userDetails, setUserDetails } = useAppContext();
  const signUpMode = userDetails?.signUpType;

  const { data: _getAllWorkspaces, isLoading: _isLoading } = useGetMyWorkspaces(signUpMode);

  const navigateHandler = ({ last = true, email }) => {
    setTimeout(() => {
      window.location.href = last ? './dashboard' : `/on-boarding/${email}`;
    }, 2000);
  };

  useEffect(() => {
    const data = userDetails;
    if (_getAllWorkspaces?.workspaces?.length) {
      data.lastAccessedWorkspace = _getAllWorkspaces?.workspaces?.[0]?.workSpaceId;
      data.activePlan = _getAllWorkspaces?.workspaces?.[0]?.plan;
      localStorage.setItem('user', JSON.stringify(data));
      setUserDetails(data);
      navigateHandler({ last: true, email: '' });
    }
    if (_getAllWorkspaces?.workspaces?.length === 0) {
      navigateHandler({ last: false, email: data.email });
    }
    if (_getAllWorkspaces?.msg === 'Workspace missing') {
      navigateHandler({ last: false, email: data.email });
    }
  }, [_getAllWorkspaces]);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div>
        <Loader />
      </div>
    </div>
  );
};

export default Index;
