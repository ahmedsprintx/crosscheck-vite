import Modal from 'components/modal';
import Button from 'components/button';
import PropTypes from 'prop-types';

import style from './remove-confirm-modal.module.scss';
import DelIcon from 'components/icon-component/del-icon';

const DeleteModal = ({
  handleUserDelete,
  removeText,
  cancelText,
  title,
  subtitle,
  icon,
  openDelModal,
  setOpenDelModal,
}) => {
  let id = openDelModal;

  return (
    <Modal open={openDelModal} handleClose={() => setOpenDelModal(false)} className={style.mainDiv}>
      <div className={`${icon ? style.iconRefreshLarge : style.iconRefresh}`}>{icon ? icon : <DelIcon />}</div>

      <p className={style.modalTitle}>{title ? title : 'Are you sure you want to delete this user?'}</p>
      <p className={style.modalSubtitle}>{subtitle && subtitle}</p>
      <div className={style.mainBtnDiv}>
        <Button text={removeText ? removeText : 'Yes, delete this user'} handleClick={() => handleUserDelete(id)} />
        <Button
          text={cancelText ? cancelText : 'No, keep it'}
          btnClass={style.btnClassUncheckModal}
          handleClick={() => setOpenDelModal(false)}
        />
      </div>
    </Modal>
  );
};

DeleteModal.propTypes = {
  handleUserDelete: PropTypes.func.isRequired,
  removeText: PropTypes.string.isRequired,
  cancelText: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired, // NOTE: You might adjust this depending on the actual type of 'icon'
  openDelModal: PropTypes.bool.isRequired,
  setOpenDelModal: PropTypes.func.isRequired,
};

export default DeleteModal;
