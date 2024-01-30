import React, { useRef, useState } from 'react';

import Modal from 'components/modal';
import Button from 'components/button';
import SelectBox from 'components/select-box';
import TextField from 'components/text-field';
import TextArea from 'components/text-area';
import GenericTable from 'components/generic-table';
import { columnsData, rows } from './helper';
import { locationOptions } from './helper';

import cross from 'assets/cross.svg';
import icon from 'assets/retest-icon.svg';
import style from './retest.module.scss';
import TaskCreated from './task-created';
import CrossIcon from 'components/icon-component/cross';
import RetestIcon from 'components/icon-component/retest-icon';

const CreateTicket = ({ openCreateTicket, setOpenCreateTicket, control }) => {
  const { ref } = useRef;

  const [openTaskCreated, setOpenTaskCreated] = useState(false);

  return (
    <>
      <Modal
        open={openCreateTicket}
        handleClose={() => setOpenCreateTicket(false)}
        className={style.mainDiv}
        backClass={style.modal}
      >
        <div className={style.crossImg}>
          <span className={style.modalTitle}>Create Ticket</span>
          <div onClick={() => setOpenCreateTicket(false)} className={style.hover}>
            <CrossIcon />
            <div className={style.tooltip}>
              <p>Close</p>
            </div>
          </div>
        </div>
        <p className={style.p}>Bug-102, Bug-103, Bug-104 </p>
        <div>
          <SelectBox
            options={locationOptions}
            label={'Assign to'}
            name={'Assign to'}
            control={control}
            numberBadgeColor={'#39695b'}
            dynamicClass={style.zDynamicState4}
            showNumber
            isMulti
            placeholder="Select"
          />
        </div>

        <div className={style.flex}>
          <RetestIcon />
          <p>Ticket Creation History</p>
        </div>
        <div className={style.tableWidth}>
          <GenericTable
            ref={ref}
            columns={columnsData}
            dataSource={rows || []}
            height={'300px'}
            classes={{
              test: style.test,
              table: style.table,
              thead: style.thead,
              th: style.th,
              containerClass: style.checkboxContainer,
              tableBody: style.tableRow,
            }}
          />
        </div>
        <div className={style.innerFlex}>
          <p onClick={() => setOpenCreateTicket(false)}>Discard</p>
          <Button
            text="Save"
            handleClick={() => {
              setOpenTaskCreated(true);
              setOpenCreateTicket(false);
            }}
          />
        </div>
      </Modal>
      <TaskCreated openTaskCreated={openTaskCreated} setOpenTaskCreated={setOpenTaskCreated} />
    </>
  );
};

export default CreateTicket;
