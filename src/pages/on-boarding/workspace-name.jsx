import React from 'react';

import style from './boarding.module.scss';
import TextField from 'components/text-field';
import Button from 'components/button';

const WorkspaceName = ({ register, active, setActive }) => {
  return (
    <>
      <div className={style.workspace}>
        <h3>Name your Workspace:</h3>
        <p>You can user your company or organization name</p>
        <TextField
          register={() =>
            register('name', {
              required: 'Required',
            })
          }
          placeholder="Enter your workspace name here"
          name="name"
          type="text"
          data-cy="onbaording-naming of workspace"
          className={style.nameInput}
        />
      </div>
      <div className={style.btnFlex}>
        {active === 0 ? (
          <div></div>
        ) : (
          <Button
            type={'button'}
            text="Back"
            btnClass={style.btn}
            handleClick={() => setActive(active - 1)}
          />
        )}

        <Button
          text="Next"
          btnClass={style.nextBtn}
          type={'button'}
          handleClick={(e) => {
            setActive(active + 1);
          }}
          data-cy="onbaording-naming-workspace-btn"
        />
      </div>
    </>
  );
};

export default WorkspaceName;
