import PropTypes from 'prop-types';
import style from './activity-card.module.scss';
import { formatDistanceToNow } from 'date-fns';
const ActivityCard = ({ title, description, createdAt }) => {
  return (
    <>
      <div className={style.cardWrapper}>
        <div className={style.cardWrapper2} style={{ display: 'flex', flexDirection: 'row' }}>
          <p dangerouslySetInnerHTML={{ __html: title }}></p>{' '}
          <li className={style.time}>
            <span>•</span>
            <span>
              {' '}
              {` ${formatDistanceToNow(new Date(createdAt), {
                includeSeconds: true,
              })}`}
            </span>
          </li>
        </div>
        {description &&
          description?.split('\n').map((x) => {
            return (
              <div className={style.infoContent}>
                <p dangerouslySetInnerHTML={{ __html: x }} />
              </div>
            );
          })}
      </div>
    </>
  );
};
ActivityCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  createdAt: PropTypes.any.isRequired,
};

export default ActivityCard;
