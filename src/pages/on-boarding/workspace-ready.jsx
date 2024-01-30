import React from 'react';

import Button from 'components/button';

import rocket from 'assets/rocket.svg';
import style from './boarding.module.scss';

const WorkspaceReady = () => {
  const jumptoDashboard = () => {
    const url = `/dashboard`;
    window.location.href = url;
  };
  return (
    <>
      <div className={style.ready}>
        <img src={rocket} alt="" />
        <p>Your new workspace is ready to empower quality excellence!</p>
        <p>Together, we'll create a world-class product. Happy testing!</p>
        <Button
          type={'button'}
          text={'Let’s Jump into App'}
          handleClick={() => jumptoDashboard()}
        />
      </div>
    </>
  );
};

export default WorkspaceReady;
