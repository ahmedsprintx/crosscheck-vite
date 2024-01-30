import React, { useState } from 'react';

import noData from 'assets/no-found.svg';

import style from './drawer.module.scss';
import { useUpdateStatusTestCase } from 'hooks/api-hooks/test-cases/test-cases.hook';
import { useToaster } from 'hooks/use-toaster';
import TestCaseCard from './test-case-card';
import Loader from 'components/loader';

const Drawer = ({
  testCasesRef,
  noHeader,
  setAddBug,
  setEditRecord,
  testCases,
  refetch,
  page,
  isLoading,
}) => {
  const { toastError, toastSuccess } = useToaster();

  const { mutateAsync: _updateStatusHandler } = useUpdateStatusTestCase();
  const statusChangeHandler = async (id, testStatus) => {
    try {
      const res = await _updateStatusHandler({
        id,
        body: {
          testStatus,
        },
      });
      toastSuccess(res.msg);
      refetch(id, testStatus);
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <>
      <div className={style.main}>
        {isLoading && page < 2 ? (
          <Loader />
        ) : testCases?.length ? (
          <div className={style.body}>
            <div className={style.mainMain}>
              <p className={style.testCases}>
                Test Cases(
                {testCases?.filter((x) => x.status === 'Passed')?.length}/{testCases?.length})
              </p>
              <div className={style.div} />
              <div className={style.passFail}>
                <p>Pass</p>
                <h6>{testCases?.filter((x) => x.status === 'Passed')?.length}</h6>
                <div
                  style={{
                    borderLeft: '1px solid #8B909A',
                    height: '22px',
                  }}
                />
                <p>Fail</p>
                <h6
                  style={{
                    color: '#E02B2B',
                  }}
                >
                  {testCases?.filter((x) => x.status === 'Failed')?.length}
                </h6>{' '}
                <div
                  style={{
                    borderLeft: '1px solid #8B909A',
                    height: '22px',
                  }}
                />
                <p>Block</p>
                <h6
                  style={{
                    color: '#8B909A',
                  }}
                >
                  {testCases?.filter((x) => x.status === 'Blocked')?.length}
                </h6>
              </div>
            </div>
            <div ref={testCasesRef} className={style.height} style={{ height: '58vh' }}>
              {testCases.map((ele, index) => (
                <TestCaseCard
                  key={ele?._id}
                  data={ele}
                  index={index}
                  setAddBug={setAddBug}
                  setEditRecord={setEditRecord}
                  onStatusChange={statusChangeHandler}
                />
              ))}
            </div>
            {isLoading && <Loader tableMode />}
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 'calc(100vh - 265px)',
            }}
          >
            <img src={noData} alt="no-data" />
          </div>
        )}
      </div>
    </>
  );
};

export default Drawer;
