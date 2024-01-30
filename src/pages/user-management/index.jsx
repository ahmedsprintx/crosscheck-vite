import { useEffect, useRef, useState } from 'react';

import Button from 'components/button';
import GenericTable from 'components/generic-table';
import { columnsData, columnsDataInvitees } from './helper';
import _ from 'lodash';

import style from './user.module.scss';

import { useForm } from 'react-hook-form';

import MainWrapper from 'components/layout/main-wrapper';
import {
  useRemoveUser,
  useToggleUserStatus,
  useGetInvitees,
  useGetUsers,
} from 'hooks/api-hooks/settings/user-management.hook';
import { useToaster } from 'hooks/use-toaster';
import { useAppContext } from 'context/app.context';
import { formattedDate } from 'utils/date-handler';
import Permissions from 'components/permissions';
import Loader from 'components/loader';
import RemoveUserIcon from 'components/icon-component/remove-user';
import ChangeRole from './change-role-modal';
import ChangeClickupId from './change-clickup-id-modal';
import RemoveModal from './remove-modal';
import InviteModal from './invite-modal';
import Tabs from 'components/tabs';
import InfoIcon from 'components/icon-component/info-icon';
import SeatsFullModal from './seats-full';

const UserManagement = () => {
  const containerRef = useRef(null);
  const [changeRole, setChangeRole] = useState(null);
  const [inviteUser, setInviteUser] = useState(null);
  const [changeClickup, setChangeClickup] = useState(null);
  const [editUserId, setEditUserId] = useState(null);
  const [openMenu, setOpenMenu] = useState({});
  const [openMenuMobile, setopenMenuMobile] = useState(false);
  const [openMenuInviteMobile, setopenMenuInviteMobile] = useState(false);
  const [seatsFull, setSeatsFull] = useState(false);
  const [invitees, setInvitees] = useState({});
  const [activeTab, setActiveTab] = useState(0);

  const [addPopUp, setAddPopUp] = useState(false);
  const [setOpenDelModal] = useState(false);
  const [openRemoveModal, setOpenRemoveModal] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: '',
    sort: '',
    search: '',
  });

  const { control, setError } = useForm();

  const { toastError, toastSuccess } = useToaster();
  const { userDetails } = useAppContext();
  const [users, setUsers] = useState({ count: 0, users: [] });
  const [page, setPage] = useState(1);

  const {
    data: _userData,
    isLoading: isRefetching,
    refetch,
  } = useGetUsers({
    ...filters,
    page,
    perPage: 25,
    onSuccess: (data) => {
      setUsers((pre) => ({
        ...pre,
        count: data.count,
        users: _.uniqBy([...(pre.users || []), ...data.users], '_id'),
      }));
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollHeight - Math.ceil(scrollTop) === clientHeight && users.count !== users.users.length) {
        setPage((prev) => prev + 1);
      }
    };
    containerRef?.current?.addEventListener('scroll', handleScroll);
    return () => {
      containerRef?.current?.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef, _userData]);

  const { mutateAsync: _removeUSerHandler, isLoading: _isRemovingUser } = useRemoveUser();
  const { mutateAsync: _toggleStatusHandler } = useToggleUserStatus();
  const { mutateAsync: _getAllInvitees, isLoading: _isLoading } = useGetInvitees();

  // NOTE: get invitees
  const fetchInvitees = async () => {
    try {
      const response = await _getAllInvitees();
      setInvitees(response?.invitees?.invitees);
    } catch (error) {
      toastError(error);
    }
  };
  useEffect(() => {
    fetchInvitees();
  }, []);

  // NOTE: for toggle             // NOTE: complete
  const handleSwitch = async (id, user) => {
    try {
      const res = await _toggleStatusHandler({ id, user });
      toastSuccess(res.status ? 'User Status set to Active' : 'User Status set to Not Active');
    } catch (error) {
      toastError(error, setError);
    }
  };
  // NOTE: for userRemoving     // NOTE: complete
  const handleUserRemove = async (email) => {
    const memberEmail = {
      memberEmail: email,
    };
    try {
      const res = await _removeUSerHandler({ body: memberEmail });
      toastSuccess(res?.msg);
      setOpenRemoveModal(null);
      setOpenMenu(false);
      fetchInvitees();
      setUsers({});
      await refetch();
    } catch (error) {
      toastError(error);
    }
    setOpenDelModal(false);
  };

  // NOTE: update users on frontend when user is added  // NOTE: complete
  const resetHandler = () => {
    setAddPopUp(false);
    setEditUserId(null);
  };

  // NOTE: get users on frontend as per search query
  const handleFilterChange = _.debounce(({ sortBy = '', sort = '', search = '' }) => {
    setUsers({ count: 0, users: [] });
    setPage(() => 1);
    setFilters((pre) => ({
      ...pre,
      sortBy,
      sort,
      search,
    }));
  }, 1000);

  const menu = [
    {
      title: 'Edit Clickup ID',
      click: () => {
        setChangeClickup({ id: openMenu?._id, clickUpId: openMenu?.clickUpUserId });
        setOpenMenu(null);
      },
    },

    {
      title: 'Change Role',
      click: () => {
        setChangeRole({ id: openMenu?._id, role: openMenu?.role });
        setOpenMenu(null);
      },
    },
    {
      title: 'Remove User',
      click: () => {
        setOpenRemoveModal(openMenu?._id);
        setOpenMenu(openMenu?.email);
      },
    },
  ];
  const invitesMenu = [
    {
      title: 'Cancel Invite',
      click: () => {
        setOpenRemoveModal(openMenu?._id);
        setOpenMenu(openMenu?.email);
      },
    },
  ];
  const pages = [
    {
      tabTitle: 'Active User',
      content: (
        <>
          <div className={style.header}>
            <h6>Total Users ({users?.count || 0})</h6>
            <div className={style.seatDiv}>
              <div className={style.info}>
                Seats({_userData?.userAnalytics})
                <span className={style.imgDivTooltip}>
                  <InfoIcon />
                  <div className={style.tooltip}>This includes seats in active users & invites</div>
                </span>
              </div>
              <div className={style.info}>
                <span className={style.imgDivTooltip}>
                  Developer Role({_userData?.devAnalytics})
                  <InfoIcon />
                  <div className={style.tooltip}>This includes seats in active users & invites</div>
                </span>
              </div>
            </div>
            <div className={`${style.searchButtonWrapper}`}>
              <Permissions allowedRoles={['Admin']} currentRole={userDetails?.role}>
                <Button
                  text="Invite User"
                  handleClick={() => {
                    setEditUserId(false);
                    setInviteUser(true);
                  }}
                />
              </Permissions>
            </div>
          </div>
          <div className={style.seatDivMobile}>
            <div className={style.info}>
              Seats({_userData?.userAnalytics})
              <span className={style.imgDivTooltip}>
                <InfoIcon />
                <div className={style.tooltip1}>This includes seats in active users & invites</div>
              </span>
            </div>
            <div className={style.info}>
              <span className={style.imgDivTooltip}>
                Developer Role({_userData?.devAnalytics})
                <InfoIcon />
                <div className={style.tooltip}>This includes seats in active users & invites</div>
              </span>
            </div>
          </div>
          {users.length <= 0 && isRefetching ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 'calc(100vh - 265px)',
              }}
            >
              <Loader />
            </div>
          ) : !users && page < 2 ? (
            <Loader />
          ) : (
            <div className={style.tableWidth} style={{ position: 'relative' }}>
              <GenericTable
                containerRef={containerRef}
                columns={columnsData({
                  control,
                  handleSwitch,
                  users: users || [],
                  setEditUserId,
                  setChangeRole,
                  setOpenDelModal,
                  setAddPopUp,
                  openMenuMobile,
                  searchedText: filters?.search,
                  setopenMenuMobile,
                  changeClickup,
                  setChangeClickup,
                  userDetails,
                  openMenu,
                  menu,
                  setOpenMenu,
                })}
                dataSource={users?.users || []}
                addPopUp={addPopUp}
                height={'calc(100vh - 230px)'}
                classes={{
                  test: style.test,
                  table: style.table,
                  thead: style.thead,
                  th: style.th,
                  containerClass: style.checkboxContainer,
                  tableBody: style.tableRow,
                }}
                filters={filters}
                onClickHeader={({ sortBy, sort }) => {
                  handleFilterChange({ sortBy, sort });
                }}
                isEditMode={true}
                editUserId={editUserId}
                cancelEvent={() => editUserId && setEditUserId(null)}
                handleUpdatedUser={() => {
                  refetch();
                  resetHandler();
                }}
              />
              {isRefetching && <Loader tableMode />}
            </div>
          )}
        </>
      ),
    },
    {
      tabTitle: 'Invites',
      content: (
        <>
          <div className={style.header}>
            <h6>Total Invites ({invitees?.length || 0})</h6>
            <div className={`${style.searchButtonWrapper}`}>
              <Permissions allowedRoles={['Admin']} currentRole={userDetails?.role}>
                <Button
                  text="Invite User"
                  handleClick={() => {
                    setSeatsFull(true);
                  }}
                />
              </Permissions>
            </div>
          </div>
          {!invitees && page < 2 ? (
            <Loader />
          ) : (
            <div className={style.tableWidth} style={{ position: 'relative' }}>
              <GenericTable
                containerRef={containerRef}
                columns={columnsDataInvitees({
                  control,
                  handleSwitch,
                  users: invitees || [],
                  setEditUserId,
                  setChangeRole,
                  setOpenDelModal,
                  openMenuInviteMobile,
                  setopenMenuInviteMobile,
                  setAddPopUp,
                  changeClickup,
                  setChangeClickup,
                  openMenu,
                  userDetails,
                  invitesMenu,
                  setOpenMenu,
                })}
                dataSource={(invitees && invitees) || []}
                addPopUp={addPopUp}
                height={'calc(100vh - 230px)'}
                classes={{
                  test: style.test,
                  table: style.table,
                  thead: style.thead,
                  th: style.th2,
                  containerClass: style.checkboxContainer,
                  tableBody: style.tableRow,
                }}
                filters={filters}
                onClickHeader={({ sortBy, sort }) => {
                  handleFilterChange({ sortBy, sort });
                }}
                isEditMode={true}
                editUserId={editUserId}
                cancelEvent={() => editUserId && setEditUserId(null)}
                handleUpdatedUser={() => {
                  refetch();
                  resetHandler();
                }}
              />
              {isRefetching && <Loader tableMode />}
            </div>
          )}
          ,
        </>
      ),
    },
  ];

  return (
    <MainWrapper
      title="User Management"
      date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}
      searchField={activeTab !== 1 && true}
      onSearch={(e) => handleFilterChange({ search: e.target.value })}
      onClear={() => handleFilterChange({ search: '' })}
    >
      <div className={style.userMain}>
        {!_isLoading && <Tabs pages={pages} activeTab={activeTab} setActiveTab={setActiveTab} />}

        {changeRole?.id && (
          <ChangeRole
            setUsers={setUsers}
            changeRole={changeRole}
            setChangeRole={setChangeRole}
            refetch={refetch}
            setOpenMenu={setOpenMenu}
          />
        )}
        {changeClickup?.id && (
          <ChangeClickupId
            changeClickup={changeClickup}
            setChangeClickup={setChangeClickup}
            setOpenMenu={setOpenMenu}
          />
        )}

        {openRemoveModal && (
          <RemoveModal
            icon={<RemoveUserIcon />}
            openRemoveModal={openRemoveModal}
            setOpenRemoveModal={setOpenRemoveModal}
            title={'Are you sure you want cancel the invitation?'}
            removeText={'Yes, Cancel this Invitation'}
            handleUserRemove={handleUserRemove}
            selectedUser={openMenu}
            loading={_isRemovingUser}
          />
        )}
      </div>
      {inviteUser && (
        <InviteModal inviteUser={inviteUser} setInviteUser={setInviteUser} refetchInvites={fetchInvitees} />
      )}
      {seatsFull && <SeatsFullModal setSeatsFull={setSeatsFull} seatsFull={seatsFull} />}
      {openMenu?.length > 0 && <div className={style.backdropDiv} onClick={() => setOpenMenu({})}></div>}
    </MainWrapper>
  );
};

export default UserManagement;
