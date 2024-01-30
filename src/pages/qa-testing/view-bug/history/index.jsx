import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';

import style from './history.module.scss';
import { columnsData, rows } from './helper';
import GenericTable from 'components/generic-table';
import { useState } from 'react';

const History = ({ history }) => {
  const ref = useRef();
  const [isHoveringName, setIsHoveringName] = useState({});
  return (
    <div className={style.main}>
      <div className={style.tableWidth}>
        <GenericTable
          ref={ref}
          columns={columnsData({ isHoveringName, setIsHoveringName })}
          dataSource={history || []}
          height={'350px'}
          selectable={true}
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
    </div>
  );
};

export default History;
