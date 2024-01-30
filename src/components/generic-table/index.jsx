/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import TableCell from './table-cell';

import ascendingIcon from 'assets/arrow-up.svg';

import noFound from 'assets/no-found.svg';
import EditAddTable from 'pages/user-management/edit-add';
import TableDraggableComponent from 'components/dragable/table-draggable';
import style from './generic-table.module.scss';

const GenericTable = ({
  columns = [],
  filters,
  containerRef,
  dataSource,
  loading = false,
  height,
  width,
  classes,
  onDragUpdate,
  draggable,
  optionMenu,
  separateDraggingElement,
  onClickHeader = (e) => {},
  isEditMode = false,
  editUserId,
  overflowX = 'auto',
  cancelEvent,
  handleUpdatedUser,
  selectedItem,
  setRightClickedRecord = () => {},
  id,
  menuData,
  noHeader,
  setMenu,
  menu,
}) => {
  const [rows, setRows] = useState([]);
  const genericTableRef = useRef();
  const addWidth = useRef(null);
  const [openRow, setOpenRow] = useState(null);

  const toggleRowOpen = (index) => {
    setOpenRow((prevIndex) => (prevIndex === index ? null : index));
  };

  useEffect(() => {
    setRows([...dataSource]);
  }, [dataSource]);

  return (
    <div
      style={{
        height,
        overflowY: 'auto',
        overflowX,
        width,
      }}
      ref={containerRef}
      id={id}
    >
      <div style={{ position: 'relative', height: '100%' }}>
        <div
          style={{
            width: `${genericTableRef?.current?.offsetWidth}px`,
          }}
          className={loading ? classes?.tableOnLoading : classes?.tableOffLoading}
        ></div>
        {rows.length ? (
          <table
            ref={genericTableRef}
            className={classes?.table}
            style={{
              tableLayout: 'fixed',
              position: 'relative',
            }}
          >
            <thead className={classes?.thead}>
              <tr ref={addWidth}>
                {columns?.map(({ name, key, hidden, customHeaderClass, widthAndHeight }, i) => {
                  return (
                    !hidden && (
                      <th
                        style={{
                          width: widthAndHeight?.width,
                          padding: '0px 10px',
                          borderBottom: '2px solid var(--grey-icon)',
                        }}
                        key={key || i}
                        className={`${classes?.th} ${customHeaderClass}`}
                        onClick={() =>
                          !_.isEmpty(filters) &&
                          key !== 'actions' &&
                          onClickHeader({
                            sortBy: key,
                            sort:
                              filters?.sortBy === key
                                ? filters?.sort === 'asc'
                                  ? 'desc'
                                  : 'asc'
                                : 'asc',
                          })
                        }
                      >
                        <span
                          className={classes?.th}
                          style={{
                            cursor: key !== 'actions' && 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            position: 'relative',
                          }}
                        >
                          {name}
                          {filters?.sortBy === key &&
                            (filters?.sort === 'asc' ? (
                              <img
                                src={ascendingIcon}
                                style={{
                                  height: '8px',
                                  position: 'absolute',
                                  right: '-10px',
                                }}
                              />
                            ) : (
                              <img
                                src={ascendingIcon}
                                style={{
                                  transform: 'rotate(180deg)',
                                  height: '8px',
                                  position: 'absolute',
                                  right: '-10px',
                                }}
                              />
                            ))}
                        </span>
                      </th>
                    )
                  );
                })}
              </tr>
            </thead>
            {rows.length ? (
              <TableDraggableComponent
                menuData={menuData}
                menu={menu}
                setMenu={setMenu}
                listElements={rows}
                isDragDisabled={!draggable}
                separateDraggingElement={separateDraggingElement}
                droppableClassName={'text-capitalize'}
                draggableClassName={`${classes?.tableBody} ${style.rowHoverClass}`}
                selectedItemClass={`${style.selectedItemClass}`}
                selectedItem={selectedItem}
                draggableDraggingStyle={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  justifyItems: 'center',
                  alignItems: 'center',
                  gap: '25px',
                }}
                onDragEnd={onDragUpdate}
                renderContent={(row, index, all, provided) => {
                  return (
                    <>
                      {columns.map(
                        (col, index2) =>
                          !col.hidden && (
                            <TableCell
                              noHeader={noHeader}
                              setRightClickedRecord={setRightClickedRecord}
                              isOpen={openRow === index}
                              toggleRowOpen={() => toggleRowOpen(index)}
                              index={index2}
                              id={row._id}
                              key={index2}
                              column={col}
                              row={{ ...row, index }}
                              provided={provided}
                              optionMenu={optionMenu}
                            />
                          ),
                      )}

                      {isEditMode && editUserId === row._id && (
                        <EditAddTable
                          cancelEvent={cancelEvent}
                          width={addWidth.current?.offsetWidth}
                          editUserId={editUserId}
                          handleUpdatedUser={handleUpdatedUser}
                          actionType="edit"
                        />
                      )}
                    </>
                  );
                }}
              />
            ) : (
              'renderNoDataFound'
            )}
          </table>
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <img src={noFound} alt="" />
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(GenericTable);
