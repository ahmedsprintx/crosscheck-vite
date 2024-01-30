import React, { useState } from 'react';
import { useGetDevReport } from 'hooks/api-hooks/dashboard/dashboard.hook';
import { useEffect } from 'react';

import dots from 'assets/threeDots.svg';

import Menu from 'components/menu';
import Checkbox from 'components/checkbox';
import { useProjectOptions } from '../helper';

import style from './report.module.scss';
import Permissions from 'components/permissions';
import { useNavigate } from 'react-router-dom';
import MobileMenu from 'components/mobile-menu';
import TableModal from 'components/table-modal';
import Loader from 'components/loader';
import UpDownArrow from 'components/icon-component/up-down-arrows';

const DevReport = ({ userDetails }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [tableModal, setTableModal] = useState(false);
  const [tableModalType, setTableModalType] = useState('');
  const [checkedUsers, setCheckedUsers] = useState([]);
  const [report, setReport] = useState({});
  const { data = {} } = useProjectOptions();
  const { devOptions = [] } = data;
  const [filters, setFilters] = useState({
    allDevUserIds: userDetails?.role === 'QA' ? [userDetails?.id] : [],
  });

  // NOTE: getReport
  const { mutateAsync: _getAllDevReport, isLoading: _isGettingDev } = useGetDevReport();
  const fetchDevReport = async (filters) => {
    try {
      const response = await _getAllDevReport(filters);
      setReport(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDevReport(filters);
  }, [filters]);

  useEffect(() => {
    checkedUsers &&
      userDetails?.role === 'Admin' &&
      setFilters((prev) => ({
        ...prev,
        allDevUserIds: checkedUsers,
      }));
  }, [checkedUsers]);

  const checker = (id) => {
    if (id === '-select-all-') {
      checkedUsers?.length === devOptions.length - 1
        ? setCheckedUsers([])
        : setCheckedUsers(() => devOptions.filter((x) => x.value !== '-select-all-').map((x) => x.value));
    } else {
      setCheckedUsers((pre) => (pre.includes(id) ? pre.filter((x) => x !== id) : [...pre, id]));
    }
  };

  const userMenu = devOptions?.map((item) => ({
    compo: item.checkbox ? (
      <Checkbox
        checked={
          item?.value === '-select-all-'
            ? checkedUsers?.length === devOptions?.length - 1
            : checkedUsers?.includes(item?.value)
        }
        handleChange={(e) => {
          checker(item?.value);
        }}
      />
    ) : null,

    title: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginLeft: '5px' }}>
        {item?.profilePicture ||
          (item?.imagAlt && <div className={style.imgDiv}>{item?.profilePicture || item?.imagAlt}</div>)}{' '}
        {item.label || 'Default Title'}
      </div>
    ),
    click: () => {
      checker(item?.value);
    },
  }));

  const filteredHandler = (props, type, missActivity = false) => {
    const queryParams = new URLSearchParams({
      bugBy: checkedUsers || [],
      ...props,
    }).toString();

    navigate({
      pathname: '/dashboard',
      search: queryParams.toString(),
    });
  };

  return (
    <div className={style.main}>
      <div className={style.header}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            position: 'relative',
          }}
        >
          <Permissions allowedRoles={['Admin', 'Project Manager']} currentRole={userDetails?.role}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
              }}
              onClick={() => {
                setUser(true);
                setIsOpen(true);
              }}
            >
              <UpDownArrow />
              {user && (
                <div className={style.userMenuDiv}>
                  <Menu menu={userMenu} />
                </div>
              )}
            </div>
            <div className={style.userMenuDivMobile}>
              <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen}>
                {userMenu?.map((ele, index) => {
                  return (
                    <div className={style.innerDiv} onClick={ele.click} key={index}>
                      {ele?.img ||
                        (ele?.compo && (
                          <div style={{ width: '15px' }}>
                            {ele?.img ? <img src={ele?.img} alt="" /> : ele?.compo ? ele?.compo : ''}
                          </div>
                        ))}
                      {<p>{ele?.title}</p>}
                    </div>
                  );
                })}
              </MobileMenu>
            </div>
          </Permissions>

          <h2>
            {checkedUsers.length === 1
              ? `${devOptions.find((x) => x.value === checkedUsers[0]).label} `
              : checkedUsers.length > 1
              ? `Combined`
              : userDetails?.role === 'Admin'
              ? 'All Developers '
              : userDetails?.role === 'Project Manager' && 'All Developers '}
            Report
          </h2>
        </div>
        <img src={dots} />
      </div>
      {_isGettingDev ? (
        <Loader className={style.customLoader} />
      ) : (
        <>
          <div className={style.mid}>
            <div>
              <p>
                Total Bugs: <span>{report?.totalBugs ? `${report?.totalBugs}` : 0}</span>
              </p>
              <p>
                Bug Reopened Rate: <span>{report?.reopenedBugRate ? `${report?.reopenedBugRate} %` : ''}</span>
              </p>
            </div>
            <div>
              <p>
                Bug Closure Rate: <span>{report?.bugClosureRateDays ? `${report?.bugClosureRateDays} Days` : ''}</span>
              </p>
              <p>
                Bug Reproducible Rate: <span>{report?.reproducedBugRate ? `${report?.reproducedBugRate} %` : ''}</span>
              </p>
            </div>
          </div>
          <div className={style.inner}>
            <div className={style.section}>
              <div className={style.titleTime}>
                <span>Bugs Status</span>
              </div>
              <div className={style.lowerDiv}>
                <div className={style.colorSection}>
                  <div className={style.dataLine}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div
                        style={{
                          height: '10px',
                          width: '10px',
                          borderRadius: '50%',
                          backgroundColor: '#34C369',
                        }}
                      />
                      <span>Closed</span>
                    </div>
                    <span>
                      {!report?.metaData?.BugStatus?.closed ? (
                        '-'
                      ) : (
                        <span
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            filteredHandler({ status: ['Closed'] }, 'bugs', true);
                            setTableModal(true);
                            setTableModalType('bugs');
                          }}
                        >
                          {report?.metaData?.BugStatus?.closed}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className={style.dataLine}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div
                        style={{
                          height: '10px',
                          width: '10px',
                          borderRadius: '50%',
                          backgroundColor: '#F96E6E',
                        }}
                      />
                      <span>Opened</span>
                    </div>
                    <span>
                      {!report?.metaData?.BugStatus?.open ? (
                        '-'
                      ) : (
                        <span
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            filteredHandler({ status: ['Open'] }, 'bugs', true);
                            setTableModalType('bugs');
                            setTableModal(true);
                          }}
                        >
                          {report?.metaData?.BugStatus?.open}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className={style.dataLine}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div
                        style={{
                          height: '10px',
                          width: '10px',
                          borderRadius: '50%',
                          backgroundColor: '#B79C11',
                        }}
                      />
                      <span>Reproducible</span>
                    </div>
                    <span>
                      {!report?.metaData?.BugStatus?.reproducible ? (
                        '-'
                      ) : (
                        <span
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            filteredHandler({ status: ['Reproducible'] }, 'bugs', true);
                            setTableModalType('bugs');
                            setTableModal(true);
                          }}
                        >
                          {report?.metaData?.BugStatus?.reproducible}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className={style.dataLine}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div
                        style={{
                          height: '10px',
                          width: '10px',
                          borderRadius: '50%',
                          backgroundColor: '#F80101',
                        }}
                      />
                      <span>Blocked</span>
                    </div>
                    <span>
                      {!report?.metaData?.BugStatus?.blocked ? (
                        '-'
                      ) : (
                        <span
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            filteredHandler({ status: ['Blocked'] }, 'bugs', true);
                            setTableModalType('bugs');
                            setTableModal(true);
                          }}
                        >
                          {report?.metaData?.BugStatus?.blocked}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className={style.dataLine}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div
                        style={{
                          height: '10px',
                          width: '10px',
                          borderRadius: '50%',
                          backgroundColor: '#11103D',
                        }}
                      />
                      <span>Need to Discuss</span>
                    </div>
                    <span>
                      {!report?.metaData?.BugStatus?.needToDiscuss ? (
                        '-'
                      ) : (
                        <span
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            filteredHandler({ status: ['Need To Discuss'] }, 'bugs', true);
                            setTableModalType('bugs');
                            setTableModal(true);
                          }}
                        >
                          {report?.metaData?.BugStatus?.needToDiscuss}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className={style.section}>
              <div className={style.titleTime}>
                <span>Bugs Types</span>
              </div>
              <div className={style.lowerDiv}>
                <div className={style.colorSection}>
                  <div className={style.dataLine}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div
                        style={{
                          height: '10px',
                          width: '10px',
                          borderRadius: '50%',
                          backgroundColor: '#34C369',
                        }}
                      />
                      <span>UI</span>
                    </div>
                    <span>
                      {!report?.metaData?.BugType?.ui ? (
                        '-'
                      ) : (
                        <span
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            filteredHandler({ bugType: ['UI'] }, 'bugs', true);
                            setTableModalType('bugs');
                            setTableModal(true);
                          }}
                        >
                          {' '}
                          {report?.metaData?.BugType?.ui}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className={style.dataLine}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div
                        style={{
                          height: '10px',
                          width: '10px',
                          borderRadius: '50%',
                          backgroundColor: '#F96E6E',
                        }}
                      />
                      <span>Functionality</span>
                    </div>
                    <span>
                      {!report?.metaData?.BugType?.functionality ? (
                        '-'
                      ) : (
                        <span
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            filteredHandler({ bugType: ['Functionality'] }, 'bugs', true);
                            setTableModalType('bugs');
                            setTableModal(true);
                          }}
                        >
                          {report?.metaData?.BugType?.functionality}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className={style.dataLine}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div
                        style={{
                          height: '10px',
                          width: '10px',
                          borderRadius: '50%',
                          backgroundColor: '#B79C11',
                        }}
                      />
                      <span>Performance</span>
                    </div>
                    <span>
                      {!report?.metaData?.BugType?.performance ? (
                        '-'
                      ) : (
                        <span
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            filteredHandler({ bugType: ['Performance'] }, 'bugs', true);
                            setTableModalType('bugs');
                            setTableModal(true);
                          }}
                        >
                          {report?.metaData?.BugType?.performance}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className={style.dataLine}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div
                        style={{
                          height: '10px',
                          width: '10px',
                          borderRadius: '50%',
                          backgroundColor: '#F80101',
                        }}
                      />
                      <span>Security</span>
                    </div>
                    <span>
                      {!report?.metaData?.BugType?.security ? (
                        '-'
                      ) : (
                        <span
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            filteredHandler({ bugType: ['Security'] }, 'bugs', true);
                            setTableModalType('bugs');
                            setTableModal(true);
                          }}
                        >
                          {report?.metaData?.BugType?.security}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className={style.section}>
              <div className={style.titleTime}>
                <span>Bugs Severity</span>
              </div>
              <div className={style.lowerDiv} style={{ borderRight: 'none' }}>
                <div className={style.colorSection}>
                  <div className={style.dataLine}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div
                        style={{
                          height: '10px',
                          width: '10px',
                          borderRadius: '50%',
                          backgroundColor: '#F80101',
                        }}
                      />
                      <span>Critical</span>
                    </div>
                    <span>
                      {!report?.metaData?.BugSeverity?.critical ? (
                        '-'
                      ) : (
                        <span
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            filteredHandler({ severity: ['Critical'] }, 'bugs', true);
                            setTableModalType('bugs');
                            setTableModal(true);
                          }}
                        >
                          {report?.metaData?.BugSeverity?.critical}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className={style.dataLine}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div
                        style={{
                          height: '10px',
                          width: '10px',
                          borderRadius: '50%',
                          backgroundColor: '#F96E6E',
                        }}
                      />
                      <span>High</span>
                    </div>
                    <span>
                      {!report?.metaData?.BugSeverity?.high ? (
                        '-'
                      ) : (
                        <span
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            filteredHandler({ severity: ['High'] }, 'bugs', true);
                            setTableModalType('bugs');
                            setTableModal(true);
                          }}
                        >
                          {report?.metaData?.BugSeverity?.high}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className={style.dataLine}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div
                        style={{
                          height: '10px',
                          width: '10px',
                          borderRadius: '50%',
                          backgroundColor: '#B79C11',
                        }}
                      />
                      <span>Medium</span>
                    </div>
                    <span>
                      {!report?.metaData?.BugSeverity?.medium ? (
                        '-'
                      ) : (
                        <span
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            filteredHandler({ severity: ['Medium'] }, 'bugs', true);
                            setTableModalType('bugs');
                            setTableModal(true);
                          }}
                        >
                          {report?.metaData?.BugSeverity?.medium}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className={style.dataLine}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div
                        style={{
                          height: '10px',
                          width: '10px',
                          borderRadius: '50%',
                          backgroundColor: '#4F4F6E',
                        }}
                      />
                      <span>Low</span>
                    </div>
                    <span>
                      {!report?.metaData?.BugSeverity?.low ? (
                        '-'
                      ) : (
                        <span
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            filteredHandler({ severity: ['Low'] }, 'bugs', true);
                            setTableModalType('bugs');
                            setTableModal(true);
                          }}
                        >
                          {report?.metaData?.BugSeverity?.low}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <TableModal open={tableModal} setOpen={setTableModal} type={tableModalType} setType={setTableModalType} />
      {user && <div className={style.backdropDiv} onClick={() => setUser(false)}></div>}
    </div>
  );
};

export default DevReport;
