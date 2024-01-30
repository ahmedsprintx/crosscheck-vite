import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import logo from 'assets/whiteX.svg';
import logout from 'assets/logout.svg';

import home from 'assets/home.svg';
import bag from 'assets/bag.svg';

import testRunLogo from 'assets/testRunLogo.svg';
import setting from 'assets/setting.svg';
import test from 'assets/test-case.svg';
import style from './sidebar.module.scss';
import { useAppContext } from 'context/app.context';
import Permissions from 'components/permissions';

import ArrowRightSingle from 'components/icon-component/arrow-right-single';
import PlusIcon from 'components/icon-component/plus-icon';
import { useChangeWorkspace } from 'hooks/api-hooks/settings/user-management.hook';
import { useToaster } from 'hooks/use-toaster';

import { useLogout } from 'hooks/api-hooks/auth.hook';

const Sidebar = ({ pathname, myWorkspaces, matchingWorkspace }) => {
  const [open, setOpen] = useState(false);

  const [open2, setOpen2] = useState(false);
  const [selectedWorkspace, setSeletedWorspace] = useState('');
  const { toastSuccess, toastError } = useToaster();
  const { setUserDetails, userDetails } = useAppContext();
  const navigate = useNavigate();

  const signUpMode = userDetails?.signUpType;

  const handleAddWorkSpaceClick = () => {
    const url = `/on-boarding/${userDetails?.email}`;
    navigate(url);
  };
  const handleChangeWorkSpaceClick = () => {
    const url = `/dashboard`;
    navigate(url);
  };

  // NOTE: handle logout
  const { mutateAsync: _logoutHandler } = useLogout();

  const logoutFunc = async () => {
    try {
      const res = await _logoutHandler();
      localStorage.clear();
      window.location.href = '/login';
    } catch (error) {
      toastError(error);
    }
  };

  const routes = [
    {
      tooltip: 'Home',
      icon: home,
      path: '/dashboard',
      noPath: false,
    },
    {
      tooltip: 'Projects',

      icon: bag,
      path: '/projects',
      noPath: false,
    },
    {
      tooltip: 'Test Cases',
      icon: test,
      path: '/test-cases',
      noPath: false,
    },
    {
      tooltip: 'Test Run',

      icon: testRunLogo,
      noPath: false,
      path: '/test-run',
    },
    {
      tooltip: 'Bug Reporting',

      icon: setting,
      noPath: false,
      path: '/qa-testing',
    },
  ];

  const { mutateAsync: _changeWorkspaceHandler, isLoading: isSubmitting } = useChangeWorkspace();
  const changeWorkspace = async (id) => {
    try {
      const newWorkspace = myWorkspaces?.find((x) => x.workSpaceId === id);
      const res = await _changeWorkspaceHandler(id);
      toastSuccess(res.msg);
      setUserDetails({
        ...userDetails,
        role: newWorkspace.role,
        lastAccessedWorkspace: id,
        activePlan: newWorkspace.plan,
      });
      localStorage.setItem(
        'user',
        JSON.stringify({
          ...userDetails,
          role: newWorkspace.role,
          lastAccessedWorkspace: id,
          activePlan: newWorkspace.plan,
        }),
      );
      setOpen(false);
      setOpen2(false);
      handleChangeWorkSpaceClick();
    } catch (error) {
      toastError(error);
    }
  };
  return (
    <div className={style.projectsFlex}>
      <>
        <div className={style.sidebar}>
          <div className={style.logoDiv}>
            <div className={style.imgDiv}>
              <img src={logo} alt="" className={style.logo1} />
            </div>
            <div className={style.line} />
            {signUpMode === 'AppAndExtension' ? (
              <div
                className={style.workSpaceLogoDiv}
                onClick={() => setOpen((prev) => !prev)}
                data-cy="sidebar-setting-btn-icon"
              >
                {matchingWorkspace?.avatar ? (
                  <img src={matchingWorkspace?.avatar} alt="" className={style.logo2} />
                ) : (
                  <span>{matchingWorkspace?.name?.charAt(0)?.toUpperCase()}</span>
                )}
                <div className={style.tooltip}>
                  <p>{matchingWorkspace?.name}</p>
                </div>
              </div>
            ) : (
              <div className={style.workSpaceLogoDiv} onClick={() => setOpen((prev) => !prev)}>
                {userDetails?.profilePicture ? (
                  <img src={userDetails?.profilePicture} alt="" className={style.logo2} />
                ) : (
                  <span>{userDetails?.name?.charAt(0)?.toUpperCase()}</span>
                )}
                <div className={style.tooltip}>
                  <p>{userDetails?.name}</p>
                </div>
              </div>
            )}
            {/* / RoutesList/ */}
            {signUpMode === 'AppAndExtension' &&
              routes?.map((ele, index) =>
                ele?.noPath ? (
                  <div
                    className={style.routes}
                    key={index}
                    style={{
                      marginTop: '20px',
                      backgroundColor:
                        open ||
                        pathname === '/account-setting' ||
                        pathname === '/workspace-setting' ||
                        pathname === '/user-management' ||
                        pathname === '/activities' ||
                        pathname === '/trash' ||
                        pathname === '/integrations' ||
                        pathname === '/shortcuts'
                          ? 'var(--active)'
                          : '',
                    }}
                  >
                    <img src={ele.icon} onClick={ele.click && ele.click} alt="" />
                    <div className={style.tooltip}>
                      <p>{ele.tooltip}</p>
                    </div>
                  </div>
                ) : (
                  <div
                    className={style.routes}
                    key={index}
                    style={{
                      marginTop: '20px',
                      backgroundColor:
                        (pathname.startsWith(ele.path) && !ele.noPath && !open) ||
                        (ele.path === '/qa-testing' && pathname.startsWith('/bug-testing'))
                          ? 'var(--active)'
                          : '',
                    }}
                  >
                    <Link to={ele.path}>
                      <img
                        src={ele.icon}
                        alt=""
                        onClick={ele.click && ele.click}
                        data-cy={`dashboard-sidebar-project-icon${index}`}
                      />
                    </Link>
                    <div className={style.tooltip}>
                      <p>{ele.tooltip}</p>
                    </div>
                  </div>
                ),
              )}
          </div>

          {/* Logout  */}
          <div
            className={style.logoutDiv}
            onClick={() => {
              logoutFunc();
            }}
            data-cy="sidebar-logout-btn"
          >
            <img src={logout} alt="" className={style.icon} />
            <div className={style.tooltip} style={{ top: '5px' }}>
              <p>Logout</p>
            </div>
          </div>
        </div>
        {open && (
          <div className={style.position}>
            <div className={style.userInfo}>
              {userDetails?.profilePicture ? (
                <img
                  src={userDetails && userDetails?.profilePicture}
                  height={40}
                  width={40}
                  alt=""
                  style={{ borderRadius: '50%' }}
                />
              ) : (
                <span className={style.noNameIcon}>
                  {userDetails?.name
                    ?.split(' ')
                    ?.slice(0, 2)
                    ?.map((word) => word[0]?.toUpperCase())
                    ?.join('')}
                </span>
              )}
              <span className={style.matchingWSname}> {userDetails?.name}</span>
              {userDetails?.name?.length > 10 && (
                <div className={style.tooltipWs}>
                  <p>{userDetails?.name}</p>
                </div>
              )}
            </div>
            <Link
              to="/account-setting"
              onClick={() => {
                setOpen(false);
                setOpen2(false);
              }}
              className={style.innerFlex}
            >
              <p>My Setting</p>
            </Link>

            <Link
              to="/shortcuts"
              onClick={() => {
                setOpen(false);
                setOpen2(false);
              }}
              className={style.innerFlex}
            >
              <p>Shortcuts</p>
            </Link>
            {signUpMode === 'AppAndExtension' && (
              <div className={style.userInfo} onClick={() => setOpen2((prev) => !prev)}>
                <div className={style.userNameLogo}>
                  {matchingWorkspace?.avatar ? (
                    <img
                      src={matchingWorkspace?.avatar}
                      alt=""
                      className={style.logo2}
                      height={40}
                      width={40}
                      style={{ borderRadius: '50%', cursor: 'pointer' }}
                    />
                  ) : (
                    <div className={style.nameLogoCurrent}>
                      <span style={{ color: 'white' }}>{matchingWorkspace?.name?.charAt(0)?.toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <span className={style.matchingWSname}>{matchingWorkspace?.name}</span>
                <div>
                  <ArrowRightSingle />
                </div>
                {matchingWorkspace?.name?.length > 10 && open2 !== true && (
                  <div className={style.tooltipWs} style={{ top: '150px' }}>
                    <p>{matchingWorkspace?.name}</p>
                  </div>
                )}
              </div>
            )}
            <Permissions allowedRoles={['Admin', 'Owner']} currentRole={userDetails?.role}>
              <div
                onClick={() => {
                  setOpen(false);
                  setOpen2(false);
                }}
                className={style.innerFlex}
              >
                <Link
                  to="/workspace-setting"
                  onClick={() => {
                    setOpen(false);
                    setOpen2(false);
                  }}
                  className={style.innerFlex}
                >
                  <p>Workspace Settings</p>
                </Link>
              </div>
            </Permissions>
            <Permissions allowedRoles={['Admin', 'Project Manager']} currentRole={userDetails?.role}>
              <Link
                to="/user-management"
                onClick={() => {
                  setOpen(false);
                  setOpen2(false);
                }}
                className={style.innerFlex}
              >
                <p>User Management</p>
              </Link>
            </Permissions>
            {signUpMode === 'AppAndExtension' && (
              <Link
                to="/integrations"
                onClick={() => {
                  setOpen(false);
                  setOpen2(false);
                }}
                className={style.innerFlex}
              >
                <p>Integrations</p>
              </Link>
            )}
            <Permissions
              locked={userDetails?.activePlan === 'Free'}
              allowedRoles={['Admin', 'Project Manager', 'QA', 'Developer']}
              currentRole={userDetails?.role}
            >
              <Link
                to="/activities"
                onClick={() => {
                  setOpen(false);
                  setOpen2(false);
                }}
                className={style.innerFlex}
              >
                <p>Activities</p>
              </Link>
            </Permissions>
            <Permissions
              locked={userDetails?.activePlan === 'Free'}
              allowedRoles={['Admin', 'Project Manager', 'QA', 'Developer']}
              currentRole={userDetails?.role}
            >
              <Link
                to="/trash"
                onClick={() => {
                  setOpen(false);
                  setOpen2(false);
                }}
                className={style.innerFlex}
              >
                <p>Trash</p>
              </Link>
            </Permissions>
            <Permissions allowedRoles={['Admin']} currentRole={userDetails?.role}>
              <Link
                to="/billing"
                onClick={() => {
                  setOpen(false);
                  setOpen2(false);
                }}
                className={style.innerFlex}
              >
                <p>Billing</p>
              </Link>
            </Permissions>
          </div>
        )}
        {open2 && (
          <div className={style.position2}>
            <div
              className={style.addWorkSpace}
              onClick={handleAddWorkSpaceClick}
              style={{
                borderBottom: myWorkspaces?.length > 1 ? ' 1px solid #d6d6d6' : '0px solid #d6d6d6',
              }}
              data-cy="sidebar-my settings-add-workspace-btn"
            >
              <PlusIcon />
              <span>Add Workspace</span>
            </div>
            <div className={style.workspaceDiv}>
              {myWorkspaces?.length &&
                myWorkspaces
                  ?.filter((ele) => ele?.workSpaceId !== userDetails?.lastAccessedWorkspace)
                  ?.map((ele) => (
                    <div
                      className={style.userInfo}
                      onClick={() => {
                        changeWorkspace(ele?.workSpaceId);
                        setSeletedWorspace(ele?.workSpaceId);
                      }}
                      style={{ position: 'relative' }}
                    >
                      {isSubmitting === true && selectedWorkspace === ele?.workSpaceId ? (
                        <div className={style.skeletonLoader} />
                      ) : (
                        <div className={style.selectWS}>
                          <div className={style.selectWSImgDiv}>
                            {ele?.avatar ? (
                              <img src={ele?.avatar} height={40} width={40} alt="" style={{ borderRadius: '50%' }} />
                            ) : (
                              <div className={style.nameLogo}>{ele?.name?.charAt(0)?.toUpperCase()}</div>
                            )}
                          </div>
                          <span>{ele?.name}</span>
                        </div>
                      )}
                      {ele?.name?.length > 10 && (
                        <div className={style.tooltipWs}>
                          <p>{ele?.name}</p>
                        </div>
                      )}
                    </div>
                  ))}
            </div>
          </div>
        )}
        {open && (
          <div
            className={style.backdropDiv}
            onClick={() => {
              setOpen(false);
              setOpen2(false);
            }}
          ></div>
        )}
      </>
    </div>
  );
};

export default Sidebar;
