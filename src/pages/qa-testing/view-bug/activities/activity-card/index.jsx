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
          description?.split('\n').map((x, i) => {
            return (
              <div className={style.infoContent} key={i}>
                <p dangerouslySetInnerHTML={{ __html: x }} />
              </div>
            );
          })}
      </div>
    </>
  );
};

export default ActivityCard;
