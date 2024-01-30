import style from './sign.module.scss';
import Button from 'components/button';
import { useParams } from 'react-router-dom';

const WelcomePage = () => {
  const { email } = useParams();

  const handleClick = () => {
    const url = `/on-boarding/${email}`;
    window.location.href = url;
  };
  return (
    <>
      <div className={style.main}>
        <h2>Welcome to Cross Check App</h2>
        <p>Your personal workspace is few steps ahead</p>

        <Button text={'Lets Do It'} handleClick={handleClick} />
      </div>
    </>
  );
};

export default WelcomePage;
