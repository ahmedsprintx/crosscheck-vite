import React, { useState } from 'react';

import DeleteModal from 'components/delete-modal';
import AddFeature from './add-feature';

import dragIcon from 'assets/white-drag.svg';
import noFoundFeature from 'assets/feature.svg';
import style from '../milestone.module.scss';
import { useToaster } from 'hooks/use-toaster';
import {
  useAddFeature,
  useDeleteFeature,
  useEditFeature,
  useFeaturePerMileStone,
  useUpdateOrderFeature,
} from 'hooks/api-hooks/feature/feature.hook';
import { useParams } from 'react-router-dom';
import DraggableComponent from 'components/dragable/dragable';
import Permissions from 'components/permissions';
import { useAppContext } from 'context/app.context';
import ArrowLeft from 'components/icon-component/arrow-left';
import Loader from 'components/loader';
import MobileMenu from 'components/mobile-menu';

const FeatureSection = ({ selectedMilestone, setSelectedMilestones }) => {
  const { id } = useParams();
  const { data: _features, refetch, isLoading: _isLoading } = useFeaturePerMileStone(selectedMilestone?.id);

  const { mutateAsync: _addFeatureHandler } = useAddFeature();
  const { mutateAsync: _editFeatureHandler } = useEditFeature();
  const { mutateAsync: _deleteFeatureHandler } = useDeleteFeature();
  const { mutateAsync: _UpdateOrderFeatureHandler } = useUpdateOrderFeature();

  const { toastError, toastSuccess } = useToaster();
  const [moreFeature, setMoreFeature] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openDelFeatureModal, setOpenDelFeatureModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);

  const { userDetails } = useAppContext();

  const onAddFeature = async (data, featureId, setError) => {
    try {
      const res = featureId
        ? await _editFeatureHandler({
            id: featureId,
            body: { ...data },
          })
        : await _addFeatureHandler({
            ...data,
            projectId: id,
            milestoneId: selectedMilestone?.id,
          });

      toastSuccess(res.msg);
      setOpenAddModal({ open: false });
      refetch();
    } catch (error) {
      toastError(error, setError);
    }
  };

  const onDeleteFeature = async () => {
    try {
      const res = await _deleteFeatureHandler({
        id: openDelFeatureModal?._id,
        body: { name: openDelFeatureModal?.name },
      });
      if (res.msg) {
        toastSuccess(res.msg);
        setOpenDelFeatureModal({ open: false });
        refetch();
      }
    } catch (error) {
      toastError(error);
    }
  };

  const onOrderUpdate = async (e) => {
    try {
      const id = _features?.features[e?.source?.index]?._id;
      const body = {
        newOrder: e?.destination?.index,
      };
      const res = await _UpdateOrderFeatureHandler({ id, body });
      refetch();
      toastSuccess(res.msg);
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <>
      <div className={style.left}>
        {_isLoading ? (
          <Loader />
        ) : (
          <>
            <div className={style.flex}>
              <h6
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                }}
              >
                <div onClick={() => setSelectedMilestones(false)}>
                  <ArrowLeft />
                </div>
                Features
                {_features?.features?.length > 0 && <span> ({_features?.features?.length})</span>}
              </h6>
              <Permissions allowedRoles={['Admin', 'Project Manager', 'QA']} currentRole={userDetails?.role}>
                <div
                  data-cy="add-feature-btn"
                  className={style.innerFlex}
                  style={{ display: !selectedMilestone.id && 'none' }}
                  onClick={() =>
                    selectedMilestone.id
                      ? setOpenAddModal({ open: true, selectedMilestone })
                      : toastError({ msg: 'Select a MileStone First ' })
                  }
                >
                  <p> + Add Feature</p>
                </div>
              </Permissions>
            </div>

            {_features?.features.length ? (
              <DraggableComponent
                listElements={_features?.features}
                droppableClassName={style.height}
                separateDraggingElement={true}
                onDragEnd={onOrderUpdate}
                renderContent={(ele, index, all, provided) => {
                  return (
                    <>
                      {' '}
                      <div className={style.flex1} key={index}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '7px',
                          }}
                        >
                          <img
                            src={dragIcon}
                            alt=""
                            className={style.img}
                            style={{ cursor: 'grab' }}
                            {...provided.dragHandleProps}
                          />
                          <p className={style.p}>{ele.name}</p>
                        </div>
                        <div
                          data-cy={`features-menue-threedots${index}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setMoreFeature(index);
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
                        {moreFeature === index && (
                          <div className={style.popUp}>
                            <Permissions
                              allowedRoles={['Admin', 'Project Manager', 'QA']}
                              currentRole={userDetails?.role}
                            >
                              <p
                                onClick={() => {
                                  setOpenAddModal({
                                    open: true,
                                    ...ele,
                                    selectedMilestone,
                                  });
                                  setMoreFeature(false);
                                }}
                                data-cy="rename-feature"
                              >
                                Rename
                              </p>
                            </Permissions>
                            <Permissions
                              allowedRoles={['Admin', 'Project Manager', 'QA']}
                              currentRole={userDetails?.role}
                            >
                              <p
                                onClick={() => {
                                  setOpenDelFeatureModal({ open: true, ...ele });
                                  setMoreFeature(false);
                                }}
                                data-cy="delete-feature"
                              >
                                Delete
                              </p>
                            </Permissions>
                          </div>
                        )}

                        {moreFeature === index && (
                          <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen}>
                            <div className={style.popUpMenu}>
                              <Permissions
                                allowedRoles={['Admin', 'Project Manager', 'QA']}
                                currentRole={userDetails?.role}
                              >
                                <p
                                  onClick={() => {
                                    setOpenAddModal({
                                      open: true,
                                      ...ele,
                                      selectedMilestone,
                                    });
                                    setMoreFeature(false);
                                  }}
                                  data-cy=""
                                >
                                  Rename
                                </p>
                              </Permissions>
                              <Permissions allowedRoles={['Admin']} currentRole={userDetails?.role}>
                                <p
                                  onClick={() => {
                                    setOpenDelFeatureModal({ open: true, ...ele });
                                    setMoreFeature(false);
                                  }}
                                >
                                  Delete
                                </p>
                              </Permissions>
                            </div>
                          </MobileMenu>
                        )}

                        {moreFeature === index && (
                          <div className={style.backdropDiv} onClick={() => setMoreFeature(false)}></div>
                        )}
                      </div>
                    </>
                  );
                }}
              />
            ) : (
              <div className={style.center}>
                <img src={noFoundFeature} alt="" />
              </div>
            )}
          </>
        )}
      </div>
      <DeleteModal
        openDelModal={!!openDelFeatureModal?.open}
        setOpenDelModal={() => setOpenDelFeatureModal({ open: false })}
        name={'Feature'}
        secondLine={'All test cases, bugs and test runs of this feature will also be deleted.'}
        clickHandler={onDeleteFeature}
      />

      <AddFeature
        openAddModal={!!openAddModal?.open}
        setOpenAddModal={() => setOpenAddModal({ open: false })}
        id={openAddModal?._id}
        name={openAddModal?.selectedMilestone?.name}
        defaultValue={openAddModal?.name}
        clickHandler={onAddFeature}
      />
    </>
  );
};

export default FeatureSection;
