import { Link, useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import arrow from 'assets/arrow-right.svg';
import style from './start-testing.module.scss';
import MainWrapper from 'components/layout/main-wrapper';
import { formattedDate } from 'utils/date-handler';
import BorderArrowRight from 'components/icon-component/border-arrow-right';
import FunctionalIcon from 'components/icon-component/functional';
import RegressionIcon from 'components/icon-component/regression';
import IntegrationIcon from 'components/icon-component/integration';
import AcceptanceIcon from 'components/icon-component/acceptance';

const StartTesting = ({ noHeader, projectId }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const cardData = [
    {
      testIcon: <FunctionalIcon />,
      heading: 'Functional Testing',
      para: 'Lorem Ipsum is simply dummy text of the printing and typesetting',
      onClickLink: () =>
        setSearchParams({
          ...Object.fromEntries(searchParams.entries()),
          type: 'functionalTesting',
        }),
    },
    {
      testIcon: <RegressionIcon />,
      heading: 'Regression Testing',
      para: 'Lorem Ipsum is simply dummy text of the printing and typesetting',
      onClickLink: () =>
        setSearchParams({
          ...Object.fromEntries(searchParams.entries()),
          type: 'regressionTesting',
        }),
    },
    {
      testIcon: <IntegrationIcon />,
      heading: 'Integration Testing',
      para: 'Lorem Ipsum is simply dummy text of the printing and typesetting',
      onClickLink: () =>
        setSearchParams({
          ...Object.fromEntries(searchParams.entries()),
          type: 'integrationTesting',
        }),
    },
    {
      testIcon: <AcceptanceIcon />,
      heading: 'User Acceptance Testing',
      para: 'Lorem Ipsum is simply dummy text of the printing and typesetting',
      onClickLink: () =>
        setSearchParams({
          ...Object.fromEntries(searchParams.entries()),
          type: 'userAcceptanceTesting',
        }),
    },
  ];

  return (
    <>
      <MainWrapper
        title="Bugs Reporting"
        date={formattedDate(new Date(), 'EEEE, d MMMM yyyy')}
        noHeader={noHeader}
        stylesBack={noHeader ? { marginTop: '10px' } : {}}
      >
        <div className={style.main}>
          <div className={style.tabDiv}>
            <Link to={noHeader ? `/projects/${projectId}?active=2` : '/qa-testing'}>
              <p>Bugs Reporting</p>
            </Link>
            <img src={arrow} alt="" />
            <p className={style.p}>Testing Type</p>
          </div>

          <div className={style.gridCard}>
            {cardData?.map((ele, index) => (
              <div className={style.card} key={index} onClick={ele.onClickLink}>
                <div className={style.img}>{ele.testIcon} </div>
                <h6>{ele.heading}</h6>
                <p>{ele.para}</p>
                <div className={style.imgDiv} style={{ cursor: 'pointer' }} onClick={ele.onClickLink}>
                  <BorderArrowRight />
                </div>
              </div>
            ))}
          </div>
        </div>
      </MainWrapper>
    </>
  );
};
StartTesting.propTypes = {
  noHeader: PropTypes.bool,
  projectId: PropTypes.string.isRequired,
};

export default StartTesting;
