import React, { useMemo, useState } from 'react';

import Button from 'components/button';
import ProjectCard from 'components/project-card';
import DeleteModal from 'components/delete-modal';

import style from './project.module.scss';
import AddProject from '../add-project';
import MembersModal from '../members-modal';
import Permissions from 'components/permissions';
import { useAppContext } from 'context/app.context';
import MobileMenu from 'components/mobile-menu';
import { useDeleteMembers } from 'hooks/api-hooks/projects/projects.hook';
import { useToaster } from 'hooks/use-toaster';
import _ from 'lodash';
import AddProjectMMobile from '../add-project-mobile';
import { useGetUsers } from 'hooks/api-hooks/settings/user-management.hook';
import Loader from 'components/loader';

const AllProjects = ({
  projects,
  favoriteToggle,
  addProject,
  isLoading,
  archiveToggle,
  refetch,
  searchedText,
  deleteProject,
  loadingArchFav,
}) => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDelModal, setOpenDelModal] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openAllMembers, setOpenAllMembers] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { userDetails } = useAppContext();
  const { toastSuccess, toastError } = useToaster();

  const { mutateAsync: _deleteMemberHandler } = useDeleteMembers();

  const onRemoveMember = async (memberID) => {
    try {
      const res = await _deleteMemberHandler({
        id: openAllMembers?.id,
        body: {
          memberToDelete: memberID,
        },
      });
      refetch();
      toastSuccess(res?.msg);
      setOpenAllMembers(false);
    } catch (error) {
      toastError(error);
    }
  };

  const { data: _res } = useGetUsers({
    sortBy: '',
    sort: '',
    search: '',
  });

  const allMembers = useMemo(() => {
    const admins =
      _res?.users
        ?.filter((x) => x.role === 'Admin' || x.role === 'Owner' || x._id === userDetails?.id)
        .map((x) => ({ ...x, notRemove: true })) || [];
    const members = openAllMembers?.members || [];

    // NOTE: Combine admins and members, then map them to a common format
    const combinedMembers = [...admins, ...members].map((x) => ({
      name: x.name,
      email: x.email,
      profilePicture: x.profilePicture,
      _id: x._id,
      notRemove: x.notRemove,
    }));

    // NOTE: Use _.uniqBy to remove duplicates based on the _id property
    const uniqueMembers = _.uniqBy(combinedMembers, '_id');

    return uniqueMembers;
  }, [_res, openAllMembers, userDetails]);

  return (
    <div className={style.mainDiv}>
      <Permissions allowedRoles={['Admin', 'Project Manager']} currentRole={userDetails?.role}>
        <Button
          text="Add Project"
          btnClass={style.btn}
          handleClick={() => {
            setOpenAddModal(true);
            setOpenMenu(true);
          }}
          data-cy="allproject-addproject-btn"
        />
      </Permissions>
      {loadingArchFav ? (
        <Loader />
      ) : (
        <div className={style.grid}>
          {projects?.map((ele, index) => {
            return (
              <ProjectCard
                key={index}
                searchedText={searchedText}
                index={index}
                title={ele.title}
                data={ele}
                favoriteData={ele.favorites}
                setOpenAddModal={setOpenAddModal}
                setOpenMenu={setOpenMenu}
                setOpenDelModal={setOpenDelModal}
                favoriteToggle={favoriteToggle}
                archiveToggle={archiveToggle}
                setOpenAllMembers={() => {
                  setOpenAllMembers((pre) => ({
                    ...pre,
                    open: true,
                    id: ele._id,
                    members: ele?.shareWith,
                  }));
                  setIsOpen(true);
                }}
              />
            );
          })}
        </div>
      )}
      <div className={style.modalDiv}>
        {openAllMembers?.open && (
          <MembersModal
            openAllMembers={openAllMembers}
            setOpenAllMembers={() => setOpenAllMembers({ open: false })}
            refetch={refetch}
            data={_res}
          />
        )}
      </div>
      <div className={style.modalDivMobile}>
        <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen}>
          <div className={style.crossImg}>
            <span className={style.modalTitle}>Members ({allMembers?.length})</span>
          </div>
          <div>
            {allMembers?.map((profile, index) => (
              <div className={style.membersRow} key={index}>
                <div className={style.imgDiv}>
                  {profile?.profilePicture ? (
                    <img src={profile?.profilePicture} alt="" height={35} width={35} />
                  ) : (
                    <span style={{ height: '35px', width: '35px' }}>{_.first(profile?.name)}</span>
                  )}
                </div>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <p className={style.name}>{profile?.name}</p>
                  <p>{profile?.email}</p>
                </div>
                {!profile.notRemove && (
                  <Permissions allowedRoles={['Admin', 'Project Manager', 'QA']} currentRole={userDetails?.role}>
                    <Button
                      text={'Remove'}
                      btnClass={style.btnRemove}
                      handleClick={() => onRemoveMember(profile?._id)}
                    />
                  </Permissions>
                )}
              </div>
            ))}
          </div>
        </MobileMenu>
      </div>
      <div className={style.addModal}>
        {openAddModal && (
          <AddProject
            isLoading={isLoading}
            openAddModal={openAddModal}
            setOpenAddModal={setOpenAddModal}
            addProject={addProject}
          />
        )}
      </div>

      <div className={style.addModalMobile}>
        <MobileMenu isOpen={openMenu} setIsOpen={setOpenMenu}>
          {openMenu && (
            <AddProjectMMobile openAddModal={openMenu} setOpenAddModalMobile={setOpenMenu} addProject={addProject} />
          )}
        </MobileMenu>
      </div>
      <DeleteModal
        isLoading={isLoading}
        openDelModal={!!openDelModal.id}
        setOpenDelModal={() => setOpenDelModal({})}
        name={'Project'}
        secondLine={
          'All milestones, features, test cases, bugs, test runs and files of this project will also be deleted.'
        }
        clickHandler={async () => {
          await deleteProject(openDelModal.id, { name: openDelModal.name });
          setOpenDelModal({});
        }}
      />
    </div>
  );
};

export default AllProjects;
