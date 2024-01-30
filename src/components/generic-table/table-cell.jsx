import React, { memo, useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import style from './generic-table.module.scss';
import ClickUpMenu from 'components/click-up-menu';

const TableCell = ({
  id,
  column,
  row,
  index,
  provided,
  isOpen = true,
  toggleRowOpen,
  optionMenu,
  noHeader,
  setRightClickedRecord = () => {},
}) => {
  const handleCellClick = (e) => {
    toggleRowOpen(); // NOTE: Toggle the open state of the entire row
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const [points, setPoints] = useState({ x: 0, y: 0 });
  const [openRow, setOpenRow] = useState({});
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  if (column.render) {
    return (
      <>
        <td
          style={{
            padding: '10px ',
            overflowWrap: 'anywhere',
            position: 'relative',
          }}
          className={`${isOpen ? style.tableRowClicked : style.tableRow}`}
          onClick={handleCellClick}
          onContextMenu={(e) => {
            e.preventDefault();
            setMenuOpen(true);
            setOpenRow(row);
            setRightClickedRecord(row);
            setPoints({
              x: e.pageX,
              y: e.pageY,
            });
          }}
        >
          {column?.render({
            profilePicture: row?.profilePicture,
            value: row[column.key],
            row,
            ...(provided && { provided }),
            id,
            index,
          })}
          {menuOpen &&
            optionMenu &&
            ReactDOM.createPortal(
              <div
                ref={menuRef}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className={style.rightClickMenu}
                style={{
                  top: `${points.y}px`,
                  left: `${points.x}px`,
                  zIndex: 9999,
                }}
              >
                <ClickUpMenu
                  noHeader={noHeader}
                  setRightClickedRecord={setRightClickedRecord}
                  rightClickedRow={openRow}
                  setOpenRow={setOpenRow}
                  setMenuOpen={setMenuOpen}
                  menuData={optionMenu ?? []}
                />
              </div>,
              document.body,
            )}
        </td>
      </>
    );
  } else {
    return <td>{row[column.key]}</td>;
  }
};

export default memo(TableCell);
