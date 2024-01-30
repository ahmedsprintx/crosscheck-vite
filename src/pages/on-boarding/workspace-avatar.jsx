import React, { useRef } from 'react';

import { handleFile } from 'utils/file-handler';

import style from './boarding.module.scss';

import avatar from 'assets/avatar.svg';
import icon from 'assets/export-browse.png';
import Button from 'components/button';

const WorkspaceAvatar = ({ setValue, watch, setColor, active, setActive }) => {
  const fileInputRef = useRef(null);

  const fileUpload = async (event, allowedType, name) => {
    const base64 = await handleFile(event, allowedType);
    setValue(name, base64);
  };
  const handleChange = (newColor) => {
    setColor(newColor.hex);
  };

  return (
    <>
      <div className={style.workspace}>
        <h3>Choose Workspace’s Avatar:</h3>
        <div className={style.flex}>
          <label className={style.camDiv} data-cy="onboard-workspace-profile-input" htmlFor="file">
            {watch('avatar') && <img src={watch('avatar') || avatar} alt="" />}
            <input
              type="file"
              id="file"
              name="image"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={(e) => fileUpload(e, /(\.jpg|\.jpeg|\.png|\.gif)$/i, 'avatar')}
              data-cy="onboard-workspace-profile-input"
            />
            {!watch('avatar') && <img src={icon} alt="" />}
          </label>
          <div className={style.empty}>
            <p>OR</p>
          </div>
          <div className={style.colorCircle}>
            <p>{watch('name')?.charAt(0)?.toUpperCase() || '-'}</p>
          </div>
        </div>
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
            data-cy="onboard-workspace-avatar-backbtn"
          />
        )}

        <Button
          text="Next"
          btnClass={style.nextBtn}
          type={'button'}
          handleClick={(e) => {
            setActive(active + 1);
          }}
          data-cy="onboard-workspace-avatar-nxtbtn"
        />
      </div>
    </>
  );
};

export default WorkspaceAvatar;
