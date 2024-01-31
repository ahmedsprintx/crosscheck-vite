import Modal from 'components/modal';
import Button from 'components/button';

import createIcon from 'assets/created.svg';
import style from './remove-confirm-modal.module.scss';

const TaskCreated = ({ openTaskCreated, setOpenTaskCreated }) => {
  return (
    <Modal open={openTaskCreated} handleClose={() => setOpenTaskCreated(false)} className={style.mainDiv}>
      <div className={style.iconRefresh}>
        <img src={createIcon} alt="" />
      </div>

      <p className={style.modalTitle}>Task Created Successfully </p>
      <p className={style.p}>OPL-292</p>
      <div className={style.mainBtnDiv}>
        <p onClick={() => setOpenTaskCreated(false)}>Dismiss</p>
        <Button text={'View on clickup'} />
      </div>
    </Modal>
  );
};

export default TaskCreated;
