import React from 'react';
import style from './row.module.scss';
import Button from 'components/button';

import _ from 'lodash';
import Permissions from 'components/permissions';

const Row = ({ data, role, handleClick, backClass, key }) => {
  return (
    <div className={`${style.membersRow} ${backClass}`} key={key}>
      <div className={style.imgDiv}>
        {data?.profilePicture ? (
          <img src={data?.profilePicture} alt="" height={35} width={35} />
        ) : (
          <span className={style.initialSpan} style={{ height: '35px', width: '35px' }}>
            {_.first(data?.name)}
          </span>
        )}
      </div>
      <p className={style.name}>{data?.name}</p>
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          justifyContent: 'space-between',
        }}
      >
        <div className={style.rowText}>
          <p className={style.email}>{data?.email}</p>

          <div className={style.tooltip}>
            <p>{data?.email}</p>
          </div>
        </div>
        {!data.notRemove && (
          <Permissions allowedRoles={['Admin', 'Project Manager', 'QA']} currentRole={role}>
            {data?.role !== 'Admin' && (
              <Button text={'Remove'} btnClass={style.btnRemove} handleClick={() => handleClick(data?._id)} />
            )}
          </Permissions>
        )}
      </div>
    </div>
  );
};

export default Row;
