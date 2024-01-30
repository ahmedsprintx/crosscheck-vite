import style from './activity-card.module.scss';
import PropTypes from 'prop-types';
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
          description?.split('\n').map((x, i) => {
            return (
              <div key={i} className={style.infoContent}>
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
  createdAt: PropTypes.string.isRequired, // Adjust the PropTypes based on the actual type
};
export default ActivityCard;
