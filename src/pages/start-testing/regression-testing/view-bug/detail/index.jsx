import PropTypes from 'prop-types';
import style from './detail.module.scss';
import draftToHtml from 'draftjs-to-html';
const Detail = ({ data }) => {
  const { feedback, reproduceSteps, idealBehaviour, testEvidence, testEvidenceKey, testedVersion } = data;

  return (
    <div className={style.main}>
      <div className={style.headings}>
        <span>Feedback</span>
      </div>
      <div className={style.content}>
        <p
          dangerouslySetInnerHTML={{
            __html: feedback?.description && draftToHtml(JSON.parse(feedback?.description)),
          }}
        ></p>
      </div>
      <div className={style.headings}>
        <span>Steps to Reproduce</span>
      </div>
      <div className={style.content}>
        <p
          dangerouslySetInnerHTML={{
            __html: reproduceSteps?.description && draftToHtml(JSON.parse(reproduceSteps?.description)),
          }}
        ></p>
      </div>
      <div className={style.headings}>
        <span>Ideal Behaviour</span>
      </div>
      <div className={style.content}>
        <p
          dangerouslySetInnerHTML={{
            __html: idealBehaviour?.description && draftToHtml(JSON.parse(idealBehaviour?.description)),
          }}
        ></p>
      </div>
      <div className={style.headings}>
        <span>Test Evidence</span>
      </div>
      <div className={style.content}>
        <p>
          <a
            href={testEvidence}
            target="_blank"
            style={{
              textDecoration: 'underline',
              color: 'black',
            }}
            rel="noreferrer"
          >
            {testEvidenceKey}
          </a>
        </p>
      </div>
      <div className={style.headings}>
        <span>Tested Version</span>
      </div>
      <div className={style.content}>
        <p>{testedVersion}</p>
      </div>
    </div>
  );
};
Detail.propTypes = {
  data: PropTypes.any,
};
export default Detail;
