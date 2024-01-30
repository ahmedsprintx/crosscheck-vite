import React from 'react';

// NOTE: components
import Modal from 'components/modal';

// NOTE: utils

// NOTE: styles
import style from './expandable.module.scss';
import ExpandableCard from '.';

const ExpandModal = ({
  open,
  setOpen,
  className,
  title,
  data,
  containerRef,
  activeTab,
  setActiveTab,
  setQaAnalyticsPage,
  _isLoading,
}) => {
  return (
    <Modal open={open} handleClose={setOpen} className={`${style.modalClass} ${className && className}`}>
      <div className={style.innerWrapper}>
        <ExpandableCard
          expanded
          title={title}
          data={data}
          {...{
            containerRef,
            activeTab,
            setActiveTab,
            setQaAnalyticsPage,
            _isLoading,
          }}
        />
      </div>
    </Modal>
  );
};

export default ExpandModal;
