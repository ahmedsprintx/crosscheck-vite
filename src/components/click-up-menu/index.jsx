import React, { useState } from 'react';

import style from './menu.module.scss';
import Arrow from 'components/icon-component/simple-arrow';
import { useToaster } from 'hooks/use-toaster';
import { Link, useLocation } from 'react-router-dom';

const ClickUpMenu = ({
  menuData,
  noHeader,
  setOpenRow = () => {},
  rightClickedRow,
  setMenuOpen = () => {},
  setRightClickedRecord = () => {},
}) => {
  const { toastSuccess, toastError } = useToaster();
  const [moreClick, setMoreClick] = useState(false);
  const location = useLocation();
  const pageUrl = window.location.href;
  const activeValue = new URLSearchParams(location.search).get('active');

  let textToCopy = '';

  // NOTE: Generate links based on the current path
  let newTab;

  if (location.pathname === '/test-cases') {
    newTab = `${location.pathname}?testCaseId=${rightClickedRow.testCaseId}`;
  } else if (location.pathname === '/qa-testing') {
    newTab = `${location.pathname}?bugId=${rightClickedRow.bugId}`;
  } else if (location.pathname === '/test-run') {
    newTab = `${location.pathname}/${rightClickedRow._id}`;
  } else if (location.pathname === '/projects') {
    newTab = `${location.pathname}/${rightClickedRow._id}`;
  } else if (noHeader && activeValue === '1') {
    newTab = `${location.pathname}${location.search}${rightClickedRow.testCaseId}`;
  } else if (noHeader && activeValue === '2') {
    newTab = `${location.pathname}${location.search}${rightClickedRow.bugId}`;
  } else if (noHeader && activeValue === '3') {
    newTab = `${location.pathname}${location.search}&testRun=view&runId=${rightClickedRow._id}`;
  } else {
    // NOTE: Handle other paths if needed
    newTab = '/';
  }
  // NOTE: Generate text based on the current path
  let idText;

  if (location.pathname === '/test-cases') {
    idText = rightClickedRow.testCaseId;
  } else if (location.pathname === '/qa-testing') {
    idText = rightClickedRow.bugId;
  } else if (location.pathname === '/test-run') {
    idText = rightClickedRow.runId;
  } else if (location.pathname === '/projects') {
    idText = rightClickedRow.idSeries;
  } else if (noHeader && activeValue === '1') {
    idText = rightClickedRow.testCaseId;
  } else if (noHeader && activeValue === '2') {
    idText = rightClickedRow.bugId;
  } else if (noHeader && activeValue === '3') {
    idText = rightClickedRow.runId;
  } else {
    // NOTE: Handle other paths if needed
    idText = '/';
  }

  // NOTE: Generate links based on the current path
  let linkText;

  if (location.pathname === '/test-cases') {
    linkText = `${pageUrl}?testCaseId=${rightClickedRow.testCaseId}`;
  } else if (location.pathname === '/qa-testing') {
    linkText = `${pageUrl}?bugId=${rightClickedRow.bugId}`;
  } else if (location.pathname === '/test-run') {
    linkText = `${pageUrl}/${rightClickedRow._id}`;
  } else if (location.pathname === '/projects') {
    linkText = `${pageUrl}/${rightClickedRow._id}`;
  } else if (activeValue === '1') {
    linkText = `${pageUrl}?testCaseId${rightClickedRow.testCaseId}`;
  } else if (activeValue === '2') {
    linkText = `${pageUrl}?bugId=${rightClickedRow.bugId}`;
  } else if (activeValue === '3') {
    linkText = `${pageUrl}&testRun=view&runId=${rightClickedRow._id}`;
  } else {
    linkText = '/';
  }

  const copyToClipboard = (copyType) => {
    if (copyType === 'id') {
      textToCopy = idText;
    } else if (copyType === 'link') {
      textToCopy = linkText;
    }
    if (textToCopy) {
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        toastSuccess('Copied');
      } catch (err) {
        toastError('Unable to copy to clipboard', err);
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  const handleClose = () => {
    setRightClickedRecord && setRightClickedRecord({});
    setOpenRow({});
    setMenuOpen(false);
    setMoreClick(false);
  };

  return (
    <>
      <div className={style.menu}>
        <div className={style.headerDiv}>
          <p
            onClick={() => {
              copyToClipboard('id');
              handleClose();
            }}
            className={style.pClass}
          >
            Copy ID
          </p>
          <p
            onClick={() => {
              copyToClipboard('link');
              handleClose();
            }}
          >
            Copy Link
          </p>
          <Link to={newTab} target="_blank">
            <p
              onClick={() => {
                handleClose();
              }}
              className={style.pClass}
            >
              New Tab
            </p>
          </Link>
        </div>

        {menuData?.map((ele, index) => (
          <div
            className={style.body}
            style={{
              borderBottom: ele.border,
            }}
            key={index}
          >
            {ele?.bodyData?.map((el, ind) => (
              <div className={`${style.hover}`} key={ind}>
                <div
                  className={style.inner}
                  key={ind}
                  style={{
                    justifyContent: 'space-between',
                  }}
                  onClick={() => {
                    el.text !== 'Change Status' ? handleClose() : setMoreClick(true);
                  }}
                >
                  <div className={style.inner} onClick={el.click}>
                    {el.icon}
                    <p
                      className={style.p}
                      style={{
                        color: el.text === 'Delete' ? '#F80101' : '',
                      }}
                    >
                      {el.text}
                    </p>
                  </div>
                  {el.text === 'Change Status' && <Arrow backClass={style.editColor} />}
                  {el.text === 'Change Status' && moreClick && (
                    <div
                      className={style.menuMain}
                      style={{
                        right: '0px',
                        left: '101%',
                        width: '150px',
                        top: '98px',
                        border: '1px solid var(--Strokes-Stroke-A, #d6d6d6)',
                      }}
                    >
                      {el.text === 'Change Status' &&
                        el?.moreOptions?.map((options, ind) => (
                          <div onClick={() => handleClose()} key={ind}>
                            <p
                              className={style.p}
                              style={{
                                height: '30px',
                              }}
                              onClick={options?.optionClick}
                            >
                              {options?.subText}
                            </p>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default ClickUpMenu;
