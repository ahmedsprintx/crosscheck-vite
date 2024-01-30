import React, { useState } from 'react';

import AddMilestone from './add-milestone';
import DeleteModal from 'components/delete-modal';

import dragIcon from 'assets/white-drag.svg';
import noFound from 'assets/milestone.svg';
import style from '../milestone.module.scss';
import { useParams } from 'react-router-dom';
import {
  useAddMilestone,
  useDeleteMilestone,
  useEditMilestone,
  useMilestonePerProject,
  useUpdateOrderMilestone,
} from 'hooks/api-hooks/milestone/milestone.hook';
import { useToaster } from 'hooks/use-toaster';
import DraggableComponent from 'components/dragable/dragable';
import Permissions from 'components/permissions';
import { useAppContext } from 'context/app.context';
import Loader from 'components/loader';
import MobileMenu from 'components/mobile-menu';

const MilestoneSection = ({ selectedMilestone, setSelectedMilestones }) => {
  const { id } = useParams();
  const [more, setMore] = useState(false);
  const [openDelModal, setOpenDelModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { userDetails } = useAppContext();

  const [openAddModal, setOpenAddModal] = useState(false);
  const { toastSuccess, toastError } = useToaster();

  const { data: _milestones, refetch, isLoading: _isLoading } = useMilestonePerProject(id);

  const { mutateAsync: _addMilestoneHandler } = useAddMilestone();
  const { mutateAsync: _editMilestoneHandler } = useEditMilestone();
  const { mutateAsync: _deleteMilestoneHandler } = useDeleteMilestone();
  const { mutateAsync: _UpdateOrderMilestoneHandler } = useUpdateOrderMilestone();

  const onAddMilestone = async (data, milestoneId, setError) => {
    try {
      const res = milestoneId
        ? await _editMilestoneHandler({
            id: milestoneId,
            body: { ...data },
          })
        : await _addMilestoneHandler({ ...data, projectId: id });

      toastSuccess(res.msg);
      setOpenAddModal({ open: false });
      refetch();
    } catch (error) {
      toastError(error, setError);
    }
  };

  const onDeleteMileStone = async () => {
    try {
      const res = await _deleteMilestoneHandler({
        id: openDelModal?._id,
        body: { name: openDelModal?.name },
      });
      if (selectedMilestone.id === openDelModal?._id) {
        setSelectedMilestones('');
      }
      if (res.msg) {
        toastSuccess(res.msg);
        setOpenDelModal({ open: false });
        refetch();
      }
    } catch (error) {
      toastError(error);
    }
  };

  const onOrderUpdate = async (e) => {
    try {
      const id = _milestones?.milestones[e?.source?.index]?._id;
      const body = {
        newOrder: e?.destination?.index,
      };
      const res = await _UpdateOrderMilestoneHandler({ id, body });
      refetch();
      toastSuccess(res.msg);
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <>
      {' '}
      <div className={style.left}>
        {_isLoading ? (
          <Loader />
        ) : (
          <>
            <div className={style.flex}>
              <h6>
                Milestones
                {_milestones?.milestones?.length > 0 && <span> ({_milestones?.milestones?.length})</span>}
              </h6>
              <Permissions allowedRoles={['Admin', 'Project Manager', 'QA']} currentRole={userDetails?.role}>
                <div
                  data-cy="project-add-milestone"
                  className={style.innerFlex}
                  onClick={() => setOpenAddModal({ open: true })}
                >
                  <p> + Add Milestone</p>
                </div>
              </Permissions>
            </div>

            {_milestones?.milestones?.length ? (
              <DraggableComponent
                listElements={_milestones?.milestones}
                droppableClassName={style.height}
                separateDraggingElement={true}
                onDragEnd={onOrderUpdate}
                renderContent={(ele, index, all, provided) => (
                  <div
                    className={`${style.flex1} ${selectedMilestone.id === ele?._id && style.selected}`}
                    key={ele?._id}
                    id={ele?._id}
                    onClick={() => setSelectedMilestones({ id: ele?._id, name: ele?.name })}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '7px',
                      }}
                    >
                      {' '}
                      <img
                        src={dragIcon}
                        alt=""
                        className={`${style.img} handle`}
                        style={{ cursor: 'grab' }}
                        {...provided.dragHandleProps}
                      />
                      <p className={style.p}>{ele.name}</p>
                    </div>
                    <Permissions allowedRoles={['Admin', 'Project Manager', 'QA']} currentRole={userDetails?.role}>
                      <div
                        data-cy={`milestone-threedots-icon${index}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setMore(index);
                          setIsOpen(true);
                        }}
                      >
                        <svg width="7" height="8" viewBox="0 0 2 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M1 2C1.55228 2 2 1.55228 2 1C2 0.447715 1.55228 0 1 0C0.447715 0 0 0.447715 0 1C0 1.55228 0.447715 2 1 2Z"
                            fill="#8B909A"
                          />
                          <path
                            d="M1 5C1.55228 5 2 4.55228 2 4C2 3.44772 1.55228 3 1 3C0.447715 3 0 3.44772 0 4C0 4.55228 0.447715 5 1 5Z"
                            fill="#8B909A"
                          />
                          <path
                            d="M1 8C1.55228 8 2 7.55228 2 7C2 6.44772 1.55228 6 1 6C0.447715 6 0 6.44772 0 7C0 7.55228 0.447715 8 1 8Z"
                            fill="#8B909A"
                          />
                        </svg>
                      </div>
                    </Permissions>

                    {more === index && (
                      <div className={style.popUp}>
                        <Permissions allowedRoles={['Admin', 'Project Manager', 'QA']} currentRole={userDetails?.role}>
                          <p
                            onClick={() => {
                              setOpenAddModal({ open: true, ...ele });
                              setMore(false);
                            }}
                            data-cy="milestone-rename-option"
                          >
                            Rename
                          </p>
                        </Permissions>
                        <Permissions allowedRoles={['Admin', 'Project Manager', 'QA']} currentRole={userDetails?.role}>
                          <p
                            onClick={() => {
                              setOpenDelModal({ open: true, ...ele });
                              setMore(false);
                            }}
                            data-cy="milestone-del-option"
                          >
                            Delete
                          </p>
                        </Permissions>
                      </div>
                    )}

                    {more === index && (
                      <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen}>
                        <div className={style.popUpMenu}>
                          <Permissions
                            allowedRoles={['Admin', 'Project Manager', 'QA']}
                            currentRole={userDetails?.role}
                          >
                            <p
                              onClick={() => {
                                setOpenAddModal({ open: true, ...ele });
                                setMore(false);
                              }}
                            >
                              Rename
                            </p>
                          </Permissions>
                          <Permissions allowedRoles={['Admin']} currentRole={userDetails?.role}>
                            <p
                              onClick={() => {
                                setOpenDelModal({ open: true, ...ele });
                                setMore(false);
                              }}
                            >
                              Delete
                            </p>
                          </Permissions>
                        </div>
                      </MobileMenu>
                    )}

                    {more === index && <div className={style.backdropDiv} onClick={() => setMore(false)}></div>}
                  </div>
                )}
              />
            ) : (
              <div className={style.center}>
                <img src={noFound} alt="" />
              </div>
            )}
          </>
        )}
      </div>
      <DeleteModal
        openDelModal={!!openDelModal?.open}
        setOpenDelModal={() => setOpenDelModal({ open: false })}
        name={'Milestone'}
        secondLine={'All features, test cases, bugs and test runs of this milestone will also be deleted.'}
        clickHandler={onDeleteMileStone}
      />
      <AddMilestone
        openAddModal={!!openAddModal?.open}
        setOpenAddModal={() => setOpenAddModal({ open: false })}
        id={openAddModal?._id}
        defaultValue={openAddModal?.name}
        clickHandler={onAddMilestone}
        data-cy="project-add-milestone"
      />
    </>
  );
};

export default MilestoneSection;
