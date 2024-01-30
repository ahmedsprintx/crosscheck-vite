import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import Sidebar from './sidebar';

import style from './layout.module.scss';
import AccessDenied from './access-denied/access-denied';
import { useMode } from 'context/dark-mode';
import MobileHeader from './mobile-header';
import Navbar from './mobile-navbar';
import MobileMenu from 'components/mobile-menu';
import { useAppContext } from 'context/app.context';
import { useToaster } from 'hooks/use-toaster';
import { useChangeWorkspace, useGetMyWorkspaces } from 'hooks/api-hooks/settings/user-management.hook';
import ArrowRightSingle from 'components/icon-component/arrow-right-single';
import Permissions from 'components/permissions';
import LogoutBlueIcon from 'components/icon-component/logout-blue';
import plus from 'assets/plus.svg';
import arrow from 'assets/arrow-ticket.svg';
import { useLogout } from 'hooks/api-hooks/auth.hook';
import useNotification from 'hooks/use-notification';

const Layout = ({ children, allowedRoles, currentRole, locked = false }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useMode();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const { toastSuccess, toastError } = useToaster();
  const { userDetails, setUserDetails } = useAppContext();
  const [selectedWorkspace, setSeletedWorspace] = useState('');

  const signUpMode = userDetails?.signUpType;
  const handleAddWorkSpaceClick = () => {
    const url = `/on-boarding/${userDetails?.email}`;
    navigate(url);
  };

  const handleChangeWorkSpaceClick = () => {
    const url = `/dashboard`;
    navigate(url);
  };

  // NOTE: get my workspace

  const { data: _getAllWorkspaces, isLoading: _isLoading } = useGetMyWorkspaces(signUpMode);

  const matchingWorkspace =
    _getAllWorkspaces?.workspaces?.length > 0 &&
    _getAllWorkspaces?.workspaces?.find((workspaces) => workspaces?.workSpaceId === userDetails?.lastAccessedWorkspace);

  const { mutateAsync: _changeWorkspaceHandler, isLoading: isSubmitting } = useChangeWorkspace();
  const changeWorkspace = async (id) => {
    try {
      const newWorkspace = _getAllWorkspaces?.workspaces?.find((x) => x.workSpaceId === id);
      const res = await _changeWorkspaceHandler(id);
      toastSuccess(res?.msg);
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
      setIsOpen(false);
      setIsOpen2(false);
      handleChangeWorkSpaceClick();
    } catch (error) {
      toastError(error);
    }
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

  return (
    <>
      {isDarkMode !== undefined && (
        <div className={`${style.layoutWrapper}  ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
          <div className={style.mobileHeaderDiv}>
            <MobileHeader
              setIsOpen={setIsOpen}
              myWorkspaces={_getAllWorkspaces?.workspaces}
              matchingWorkspace={matchingWorkspace}
            />
          </div>
          <header
            style={{
              width: '65px',
            }}
          >
            <Sidebar
              pathname={pathname}
              myWorkspaces={_getAllWorkspaces?.workspaces}
              matchingWorkspace={matchingWorkspace}
            />
          </header>

          {currentRole || signUpMode === 'Extension' ? (
            <div className={style.sectionMargin}>
              {!locked && allowedRoles.includes(currentRole) ? children : <AccessDenied />}
            </div>
          ) : (
            ''
          )}
          {signUpMode !== 'Extension' && (
            <footer>
              <Navbar pathname={pathname} />
            </footer>
          )}
          <MobileMenu
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            myWorkspaces={_getAllWorkspaces?.workspaces}
            matchingWorkspace={matchingWorkspace}
          >
            <div className={style.menu}>
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
                <span>{userDetails?.name}</span>
              </div>
              <Link to="/account-setting" onClick={() => setIsOpen(false)} className={style.innerFlex}>
                <p>My Setting</p>
              </Link>
              <Link to="/shortcuts" onClick={() => setIsOpen(false)} className={style.innerFlex}>
                <p>Shortcuts</p>
              </Link>
              {signUpMode !== 'Extension' && (
                <>
                  {!isOpen2 && (
                    <div className={style.workspaceInfo} onClick={() => setIsOpen2(true)}>
                      <div className={style.userNameLogo}>
                        {matchingWorkspace?.avatar ? (
                          <img
                            src={matchingWorkspace?.avatar}
                            alt=""
                            className={style.logo2}
                            height={40}
                            width={40}
                            style={{ borderRadius: '50%' }}
                          />
                        ) : (
                          <div className={style.nameLogoCurrent}>
                            <span style={{ color: 'white' }}>{matchingWorkspace?.name?.charAt(0)?.toUpperCase()}</span>
                          </div>
                        )}
                      </div>
                      <span>{matchingWorkspace?.name}</span>
                      <div>
                        <ArrowRightSingle />
                      </div>
                    </div>
                  )}
                  {isOpen2 ? (
                    <div className={style.allWorkspaces}>
                      <div className={style.addDiv}>
                        <span onClick={() => setIsOpen2(false)}>
                          <img src={arrow} style={{ rotate: '180deg' }} height={12} width={12} />
                          Back
                        </span>
                        <span onClick={handleAddWorkSpaceClick}>
                          <img src={plus} />
                          Workspace
                        </span>
                      </div>

                      {_getAllWorkspaces?.workspaces?.length &&
                        _getAllWorkspaces?.workspaces
                          ?.filter((ele) => ele.workSpaceId !== userDetails?.lastAccessedWorkspace)
                          ?.map((ele) => (
                            <div
                              className={style.userInfo}
                              onClick={() => {
                                changeWorkspace(ele?.workSpaceId);
                                setSeletedWorspace(ele?.workSpaceId);
                              }}
                            >
                              {isSubmitting === true && selectedWorkspace === ele.workSpaceId ? (
                                <div className={style.skeletonLoader} />
                              ) : (
                                <>
                                  {ele?.avatar ? (
                                    <img
                                      src={ele?.avatar}
                                      height={32}
                                      width={32}
                                      alt=""
                                      style={{ borderRadius: '50%' }}
                                    />
                                  ) : (
                                    <div className={style.nameLogo}>{ele?.name?.charAt(0)?.toUpperCase()}</div>
                                  )}
                                  <span>{ele?.name}</span>
                                </>
                              )}
                            </div>
                          ))}
                    </div>
                  ) : (
                    <>
                      <div
                        onClick={() => {
                          setIsOpen(false);
                          setIsOpen(false);
                        }}
                        className={style.innerFlex}
                      >
                        <Link
                          to="/workspace-setting"
                          onClick={() => {
                            setIsOpen(false);
                            setIsOpen(false);
                          }}
                        >
                          <p>Workspace Settings</p>
                        </Link>
                      </div>

                      <Link
                        to="/integrations"
                        onClick={() => {
                          setIsOpen(false);
                          setIsOpen(false);
                        }}
                        className={style.innerFlex}
                      >
                        <p>Integrations</p>
                      </Link>
                      <Permissions allowedRoles={['Admin', 'Project Manager']} currentRole={userDetails?.role}>
                        <Link
                          to="/user-management"
                          onClick={() => {
                            setIsOpen(false);
                            setIsOpen(false);
                          }}
                          className={style.innerFlex}
                        >
                          <p>User Management</p>
                        </Link>
                      </Permissions>
                      <Permissions
                        allowedRoles={['Admin', 'Project Manager', 'QA', 'Developer']}
                        currentRole={userDetails?.role}
                        locked={userDetails?.activePlan === 'Free'}
                      >
                        <Link
                          to="/activities"
                          onClick={() => {
                            setIsOpen(false);
                            setIsOpen(false);
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
                            setIsOpen(false);
                            setIsOpen(false);
                          }}
                          className={style.innerFlex}
                        >
                          <p>Trash</p>
                        </Link>
                      </Permissions>
                      <div
                        onClick={() => {
                          setIsOpen(false);
                          setIsOpen(false);
                        }}
                        className={style.innerFlex}
                      >
                        <p>Billing</p>
                      </div>
                    </>
                  )}
                </>
              )}
              <div
                className={style.logoutDiv}
                onClick={() => {
                  logoutFunc();
                }}
              >
                <LogoutBlueIcon />
                <p>Logout</p>
              </div>
            </div>
          </MobileMenu>
        </div>
      )}
    </>
  );
};

export default Layout;
