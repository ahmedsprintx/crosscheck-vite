import { useRef } from 'react';
import PropTypes from 'prop-types';

import style from './history.module.scss';
import { columnsData } from './helper';
import GenericTable from 'components/generic-table';

const History = ({ data }) => {
  const { history } = data;
  const ref = useRef();

  return (
    <div className={style.main}>
      <div className={style.tableWidth}>
        <GenericTable
          ref={ref}
          columns={columnsData()}
          dataSource={history || []}
          height={'550px'}
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
History.propTypes = {
  data: PropTypes.any,
};
export default History;
