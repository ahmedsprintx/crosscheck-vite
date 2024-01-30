import React from 'react';
import StartTesting from 'pages/start-testing/testing-types';
import { useSearchParams } from 'react-router-dom';
import RegressionTesting from './regression-testing';

const Index = ({ noHeader, projectId }) => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');

  return (
    <>
      {' '}
      {type ? (
        <RegressionTesting {...{ type, noHeader, projectId }} />
      ) : (
        <StartTesting {...{ noHeader, projectId }} />
      )}
    </>
  );
};

export default Index;
