import React, { useState } from 'react';

import Button from 'components/button';
import DeleteModal from 'components/delete-modal';
import ProjectCard from 'components/project-card';

import style from './archive.module.scss';
import MembersModal from '../members-modal';
import AddProject from '../add-project';
import Permissions from 'components/permissions';
import { useAppContext } from 'context/app.context';
import Loader from 'components/loader';

const ArchiveProjects = ({
  archived,
  addProject,
  archiveToggle,
  favoriteToggle,
  loadingArchFav,
  refetch,
  deleteProject,
}) => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDelModal, setOpenDelModal] = useState(false);
  const [openAllMembers, setOpenAllMembers] = useState(false);
  const { userDetails } = useAppContext();

  return (
    <div className={style.mainDiv}>
      <Permissions allowedRoles={['Admin', 'Project Manager']} currentRole={userDetails?.role}>
        <Button text="Add Project" btnClass={style.btn} handleClick={() => setOpenAddModal(true)} />
      </Permissions>
      {loadingArchFav ? (
        <Loader />
      ) : (
        <div className={style.grid}>
          {archived?.map((ele, index) => {
            return (
              <ProjectCard
                key={index}
                title={ele.title}
                data={ele}
                setOpenAddModal={setOpenAddModal}
                setOpenDelModal={setOpenDelModal}
                favoriteToggle={favoriteToggle}
                archiveToggle={archiveToggle}
                setOpenAllMembers={() =>
                  setOpenAllMembers((pre) => ({
                    ...pre,
                    open: true,
                    id: ele._id,
                    members: ele?.shareWith,
                  }))
                }
                archive
              />
            );
          })}
        </div>
      )}
      {openAllMembers?.open && (
        <MembersModal
          openAllMembers={openAllMembers}
          setOpenAllMembers={() => setOpenAllMembers({ open: false })}
          refetch={refetch}
        />
      )}
      {openAddModal && (
        <AddProject
          openAddModal={openAddModal}
          setOpenAddModal={setOpenAddModal}
          addProject={addProject}
        />
      )}
      <DeleteModal
        openDelModal={!!openDelModal.id}
        setOpenDelModal={() => setOpenDelModal({})}
        name="Project"
        clickHandler={async () => {
          await deleteProject(openDelModal.id, { name: openDelModal.name });
          setOpenDelModal({});
        }}
      />
    </div>
  );
};

export default ArchiveProjects;
