import style from './more.module.scss';
import PropTypes from 'prop-types';
import { formattedDate } from 'utils/date-handler';
const More = ({ data }) => {
  return (
    <>
      {bugData(data)?.map((ele, index) => (
        <div className={style.main} key={index}>
          <div className={style.innerLeft}>
            <span>{ele.title}</span>
          </div>
          <div className={style.innerRight}>
            <span>{ele.para}</span>
          </div>
        </div>
      ))}
    </>
  );
};
More.propTypes = {
  data: PropTypes.any,
};

export default More;

const bugData = (data) => [
  {
    title: 'Testing Type',
    para: data?.testingType,
  },
  {
    title: 'Issue Type',
    para: `${data.issueType} (${data.issueType === 'Reopened Bug' ? data?.reOpenId?.bugId : ''})`,
  },
  {
    title: 'Bugs Subtype',
    para: data.bugSubType,
  },
  {
    title: 'Related Test Case',
    para: data?.relatedTestCases[0]?.testCaseId,
  },
  {
    title: 'Related Test Run',
    para: (data?.relatedTestRuns || [])?.length,
  },
  {
    title: 'Reported by',
    para: data?.reportedBy?.name,
  },
  {
    title: 'Reported at',
    para: formattedDate(data?.reportedAt, 'dd MMM, yy'),
  },
];
