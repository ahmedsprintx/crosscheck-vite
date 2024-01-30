import React, { useEffect, useMemo, useRef, useState } from 'react';

import _ from 'lodash';

import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';
import MoreMenu from 'components/more-menu';

import style from './project-card.module.scss';
import { useAppContext } from 'context/app.context';
import MoreInvertIcon from 'components/icon-component/more-invert';
import EditIcon from 'components/icon-component/edit-icon';
import StarIcon from 'components/icon-component/star';
import DelIcon from 'components/icon-component/del-icon';
import ArchiveIcon from 'components/icon-component/archieve';
import Highlighter from 'components/highlighter';
import MobileMenu from 'components/mobile-menu';
import ClickUpMenu from 'components/click-up-menu';

const ProjectCard = ({
  archive,
  data,
  favoriteToggle,
  archiveToggle,
  setOpenAddModal,
  index,
  setOpenDelModal,
  searchedText,
  setOpenMenu,
  setOpenAllMembers,
  favoriteData,
}) => {
  const [open, setOpen] = useState(false);
  const [menuBack, setMenuBack] = useState(false);
  const { userDetails } = useAppContext();
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

  const menu = useMemo(() => {
    return menuItems({
      archive,
      setOpen,
      data,
      setOpenAddModal,
      setOpenDelModal,
      favoriteToggle,
      setOpenMenu,
      archiveToggle,
      favoriteData,
      userDetails,
    });
  }, [data]);

  const navigate = useNavigate();

  const optionMenu = [
    {
      bodyData: [
        {
          click: (e) => {
            setOpenAddModal(openRow?._id);
          },
          icon: <EditIcon backClass={style.editColor} />,
          text: 'Edit',
        },
      ],
    },
    {
      bodyData: [
        {
          click: (e) => {
            favoriteToggle(e, openRow?._id);
          },
          icon: <ArchiveIcon backClass={style.editColor} />,
          text: openRow?.favorites === true ? 'Unfavourite' : 'Favourite',
        },
      ],
    },
    {
      border: '1px solid #d6d6d6',
      bodyData: [
        {
          click: (e) => {
            archiveToggle(e, openRow?._id);
          },
          icon: <ArchiveIcon backClass={style.editColor} />,
          text: openRow?.archive === true ? 'Unarchive' : 'Archive',
        },
      ],
    },
    {
      bodyData: [
        {
          click: () =>
            setOpenDelModal((pre) => ({
              ...pre,
              id: openRow?._id,
              name: openRow.name,
            })),
          icon: <DelIcon backClass={style.editColor1} />,
          text: 'Delete',
        },
      ],
    },
  ];

  return (
    <>
      <div
        className={style.mainDiv}
        onContextMenu={(e) => {
          e.preventDefault();
          setMenuOpen(true);
          setOpenRow(data);
          setPoints({
            x: e.pageX,
            y: e.pageY,
          });
        }}
      >
        <div className={style.header}>
          <p
            data-cy={`clickonprojectmodule${index}`}
            className={style.p}
            onClick={() => navigate(`/projects/${data?._id}`)}
          >
            <Highlighter search={searchedText}>{data?.name}</Highlighter>
            {data?.name.length > 28 && (
              <span className={style.tooltip}>
                <Highlighter search={searchedText}>{data?.name}</Highlighter>
              </span>
            )}
          </p>
          <div onClick={() => setOpen(true)} data-cy={`projectcard-threedots-icon${index}`}>
            <MoreInvertIcon />
          </div>
          <div className={style.modalDiv}>{open && <MoreMenu menu={_.filter(menu, (obj) => !_.isEmpty(obj))} />}</div>

          {window.innerWidth <= 490 && (
            <div className={style.modalDivMobile}>
              <MobileMenu isOpen={open} setIsOpen={setOpen}>
                <div
                  className={style.flexMain}
                  onClick={() => {
                    if (window.innerWidth <= 490) {
                      setOpenMenu(data?._id);
                    } else {
                      setOpenAddModal(data?._id);
                    }
                    setOpen(false);
                  }}
                >
                  <EditIcon />
                  <p>Edit</p>
                </div>
                <div
                  className={style.flexMain}
                  onClick={(e) => {
                    favoriteToggle(e, data?._id);
                    setOpen(false);
                  }}
                  data-cy={`projectcard-edit-icon${index}`}
                >
                  <StarIcon />
                  <p>{favoriteData ? 'Unfavorite' : 'Favorite'}</p>
                </div>
                <div
                  className={style.flexMain}
                  onClick={(e) => {
                    archiveToggle(e, data?._id);
                    setOpen(false);
                  }}
                >
                  <ArchiveIcon />
                  <p>{archive ? 'Unarchive' : 'Archive'}</p>
                </div>
                <div
                  className={style.flexMain}
                  onClick={() => {
                    setOpenDelModal((pre) => ({
                      ...pre,
                      id: data?._id,
                      name: data.name,
                    }));
                  }}
                >
                  <div className={style.imgDel}>
                    <DelIcon />
                  </div>
                  <p>Delete</p>
                </div>
              </MobileMenu>
            </div>
          )}
        </div>
        <div className={style.info}>
          <div className={style.line}>
            <p>Milestones</p>
            <span>{data?.milestoneCount ? data?.milestoneCount : 0}</span>
          </div>
          <div className={style.line}>
            <p>Features</p>
            <span>{data?.featureCount ? data?.featureCount : '0'}</span>
          </div>
          <div className={style.line}>
            <p>Bugs</p>
            <span>{data?.bugsCount ? data?.bugsCount : '0'}</span>
          </div>
          <div className={style.line}>
            <p>Test Cases</p>
            <span>{data?.testCount ? data?.testCount : '0'}</span>
          </div>
        </div>
        <div className={style.shared}>
          <p>Shared With</p>
          <div className={style.imgDiv} onClick={setOpenAllMembers}>
            {data.shareWith
              .slice(0, 4)
              .map((x) =>
                x?.profilePicture ? <img src={x?.profilePicture} alt="" /> : <span>{_.first(x?.name)}</span>,
              )}
            {data.shareWith.length > 4 && <p>{data.shareWith.length - 4}+</p>}
          </div>
        </div>
      </div>
      {open && (
        <div
          className={style.backdrop}
          onClick={() => {
            setOpen(false);
            setMenuBack(false);
          }}
        />
      )}

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
              rightClickedRow={openRow}
              setOpenRow={setOpenRow}
              setMenuOpen={setMenuOpen}
              menuData={optionMenu ?? []}
            />
          </div>,
          document.body,
        )}
    </>
  );
};

export default ProjectCard;

const menuItems = ({
  archive,
  data,
  favoriteToggle,
  archiveToggle,
  setOpen,
  setOpenAddModal,
  setOpenMenu,
  setOpenDelModal,
  favoriteData,
  userDetails, // NOTE: Assuming you have userDetails with role in this object
}) => {
  const allowedRoles = ['Admin', 'Project Manager']; // NOTE: 'Project Manager'
  const allowedDelete = ['Admin', 'Project Manager'];
  const userRole = userDetails?.role;

  const canSeeButton = allowedRoles.includes(userRole);
  const canDelete = allowedDelete.includes(userRole);

  const items = [
    ...(canSeeButton
      ? [
          {
            title: 'Edit',
            compo: <EditIcon data-cy="projectcard-threedots-icon" />,
            click: () => {
              if (window.innerWidth <= 490) {
                setOpenMenu(data?._id);
              } else {
                setOpenAddModal(data?._id);
              }
              setOpen(false);
            },
          },
        ]
      : []),

    ...(!data?.archive
      ? [
          {
            title: favoriteData ? 'Unfavorite' : 'Favorite',
            compo: <StarIcon />,
            click: (e) => {
              favoriteToggle(e, data?._id);
              setOpen(false);
            },
          },
        ]
      : []),

    ...(canSeeButton
      ? [
          {
            title: archive ? 'Unarchive' : 'Archive',
            compo: <ArchiveIcon />,
            click: (e) => {
              archiveToggle(e, data?._id);
              setOpen(false);
            },
          },
        ]
      : []),
    ...(canSeeButton && canDelete
      ? [
          {
            title: 'Delete',
            compo: <DelIcon />,
            click: () => {
              setOpenDelModal((pre) => ({
                ...pre,
                id: data?._id,
                name: data.name,
              }));
              setOpen(false);
            },
          },
        ]
      : []),
  ];

  return items;
};
