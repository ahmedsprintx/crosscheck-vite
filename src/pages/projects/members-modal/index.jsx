import React, { useMemo } from 'react';

import Modal from 'components/modal';

import _ from 'lodash';
import style from './modal.module.scss';
import Row from 'components/members-row';
import { useDeleteMembers } from 'hooks/api-hooks/projects/projects.hook';
import { useToaster } from 'hooks/use-toaster';
import { useAppContext } from 'context/app.context';
import CrossIcon from 'components/icon-component/cross';

const MembersModal = ({ data, openAllMembers, setOpenAllMembers, refetch }) => {
  const { mutateAsync: _deleteMemberHandler } = useDeleteMembers();
  const { userDetails } = useAppContext();

  const { toastSuccess, toastError } = useToaster();

  const onDelete = async (memberID) => {
    try {
      const res = await _deleteMemberHandler({
        id: openAllMembers?.id,
        body: {
          memberToDelete: memberID,
        },
      });

      toastSuccess(res?.msg);
      refetch();
      setOpenAllMembers(false);
    } catch (error) {
      toastError(error);
    }
  };
  const allMembers = useMemo(() => {
    const admins =
      data?.users
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
  }, [data, openAllMembers, userDetails]);

  return (
    <div>
      <Modal open={openAllMembers?.open} handleClose={() => setOpenAllMembers(false)} className={style.mainDiv}>
        <div className={style.crossImg}>
          <span className={style.modalTitle}>Members ({allMembers?.length})</span>
          <div onClick={() => setOpenAllMembers(false)} className={style.hover}>
            <CrossIcon />

            <div className={style.tooltip}>
              <p>Close</p>
            </div>
          </div>
        </div>
        <div>
          {allMembers?.map((profile, index) => (
            <Row data={profile} role={userDetails?.role} handleClick={onDelete} backClass={style.backClass} />
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default MembersModal;
