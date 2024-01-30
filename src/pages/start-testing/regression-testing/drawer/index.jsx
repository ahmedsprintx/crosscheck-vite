import PropTypes from 'prop-types';

import noData from 'assets/no-found.svg';

import style from './drawer.module.scss';
import { useUpdateStatusTestCase } from 'hooks/api-hooks/test-cases/test-cases.hook';
import { useToaster } from 'hooks/use-toaster';
import TestCaseCard from './test-case-card';
import ExitIcon from 'components/icon-component/exit';
import Loader from 'components/loader';

const Drawer = ({ setDrawerOpen, noHeader, setAddBug, setEditRecord, isLoading, testCases, refetch }) => {
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
      refetch();
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <>
      <div className={style.main}>
        <div className={style.header}>
          <div onClick={() => setDrawerOpen(false)}>
            <ExitIcon />
          </div>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {testCases.length ? (
              <div className={style.body}>
                <h6>{testCases?.[0]?.projectId?.name}</h6>
                <div className={style.grid}>
                  <p className={style.p}>Milestone</p>
                  <p>{testCases?.[0]?.milestoneId?.name}</p>
                  <p className={style.p}>Feature</p>
                  <p>{testCases?.[0]?.featureId?.name}</p>
                </div>
                <div className={style.mainMain}>
                  <p className={style.testCases}>
                    Test Cases(
                    {testCases?.filter((x) => x.status === 'Passed')?.length}/{testCases.length})
                  </p>
                  <div className={style.div} />
                  <div className={style.passFail}>
                    <p>Pass</p>
                    <div className={style.circleDiv}>
                      <h6>{testCases?.filter((x) => x.status === 'Passed')?.length}</h6>
                    </div>
                    <div
                      style={{
                        borderLeft: '1px solid #8B909A',
                        height: '22px',
                      }}
                    />
                    <p>Fail</p>
                    <div className={style.circleDiv}>
                      <h6
                        style={{
                          color: '#E02B2B',
                        }}
                      >
                        {testCases?.filter((x) => x.status === 'Failed')?.length}
                      </h6>{' '}
                    </div>
                    <div
                      style={{
                        borderLeft: '1px solid #8B909A',
                        height: '22px',
                      }}
                    />
                    <p>Block</p>
                    <div className={style.circleDiv}>
                      <h6
                        style={{
                          color: '#8B909A',
                        }}
                      >
                        {testCases?.filter((x) => x.status === 'Blocked')?.length}
                      </h6>
                    </div>
                  </div>
                </div>
                <div className={style.height} style={{ height: noHeader && ' calc(100vh - 430px)' }}>
                  {testCases.map((ele, index) => (
                    <TestCaseCard
                      noHeader={noHeader}
                      key={ele?._id}
                      data={ele}
                      index={index}
                      setAddBug={setAddBug}
                      setEditRecord={setEditRecord}
                      onStatusChange={statusChangeHandler}
                    />
                  ))}
                </div>
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
                <img src={noData} alt="" />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};
Drawer.propTypes = {
  setDrawerOpen: PropTypes.func.isRequired,
  noHeader: PropTypes.bool,
  setAddBug: PropTypes.func.isRequired,
  setEditRecord: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  testCases: PropTypes.array.isRequired,
  refetch: PropTypes.func.isRequired,
};

export default Drawer;
