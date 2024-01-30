import React from 'react';

import MainWrapper from 'components/layout/main-wrapper';
import { formattedDate } from 'utils/date-handler';

import { useAppContext } from 'context/app.context';
import DevDashboard from './dev-dashboard';
import QaDashboard from './qa-dashboard';
import AdminDashboard from './admin-dashboard';

const Home = () => {
  const { userDetails } = useAppContext();

  return (
    <>
      {userDetails && userDetails?.signUpType === 'AppAndExtension' && (
        <MainWrapper title="Dashboard" date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}>
          {userDetails?.role === 'Developer' ? (
            <DevDashboard />
          ) : userDetails?.role === 'QA' ? (
            <QaDashboard />
          ) : userDetails?.role === 'Admin' || userDetails?.role === 'Project Manager' ? (
            <AdminDashboard />
          ) : (
            <></>
          )}
        </MainWrapper>
      )}
    </>
  );
};

export default Home;
