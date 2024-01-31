import React from 'react';

import style from './icons.module.scss';

const BugIcon = () => {
  return (
    <>
      <svg width="78" height="80" viewBox="0 0 78 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          id="Vector"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M58.5373 5.19654C58.8474 5.00989 59.1183 4.76205 59.3344 4.46737C59.5505 4.17268 59.7075 3.83698 59.7963 3.47968C59.8852 3.12238 59.9041 2.75056 59.852 2.38572C59.7998 2.02088 59.6777 1.67025 59.4927 1.35411C59.3077 1.03796 59.0633 0.762571 58.7739 0.543851C58.4845 0.325132 58.1556 0.167424 57.8064 0.0798443C57.4572 -0.00773566 57.0945 -0.0234509 56.7393 0.0336078C56.3841 0.0906664 56.0435 0.219367 55.7371 0.412269L47.2348 5.64669C44.665 4.38305 41.8507 3.72946 39.0009 3.73447C36.1523 3.73002 33.3393 4.3836 30.7706 5.64669L22.2647 0.412269C21.6465 0.0401051 20.91 -0.0667499 20.2154 0.114931C19.5208 0.296611 18.9241 0.752142 18.5552 1.38251C18.1862 2.01288 18.0748 2.76713 18.245 3.48131C18.4153 4.1955 18.8535 4.8119 19.4644 5.19654L25.8593 9.13258C23.992 10.9543 22.5058 13.1469 21.4912 15.5767C20.4766 18.0064 19.9548 20.6226 19.9578 23.2659V24.3448C19.0255 24.847 18.1441 25.4385 17.328 26.1044C17.0718 25.8476 16.7685 25.6452 16.4357 25.5092L9.18116 22.533C8.51518 22.2755 7.77735 22.296 7.12592 22.59C6.47449 22.884 5.96133 23.4281 5.69652 24.1057C5.4317 24.7833 5.43632 25.5403 5.70937 26.2144C5.98243 26.8885 6.50218 27.426 7.15715 27.7116L13.5847 30.3493C11.8798 33.0651 10.8896 36.3017 10.8896 39.7727V44.6537H2.72826C2.00675 44.6537 1.3148 44.9477 0.804613 45.4709C0.29443 45.9942 0.0078125 46.7039 0.0078125 47.4439C0.0078125 48.1839 0.29443 48.8936 0.804613 49.4169C1.3148 49.9402 2.00675 50.2341 2.72826 50.2341H10.8896V51.1679C10.8896 55.9299 12.0141 60.4165 14.0054 64.3749L7.15715 67.1799C6.82538 67.3163 6.52303 67.5182 6.26737 67.7744C6.01172 68.0305 5.80775 68.3358 5.66713 68.6728C5.52651 69.0098 5.45198 69.3719 5.4478 69.7385C5.44362 70.105 5.50987 70.4688 5.64276 70.8091C5.77566 71.1493 5.97261 71.4594 6.22235 71.7216C6.4721 71.9839 6.76975 72.1931 7.09832 72.3373C7.42689 72.4815 7.77994 72.558 8.13732 72.5622C8.49469 72.5665 8.84939 72.4986 9.18116 72.3623L16.4357 69.3861C16.6262 69.3081 16.8075 69.2082 16.9761 69.0884C19.6062 72.4943 22.9539 75.2453 26.7683 77.1351C30.5827 79.0248 34.7648 80.0043 39.0009 80C43.2373 80.0038 47.4195 79.0238 51.2339 77.1334C55.0484 75.243 58.3959 72.4913 61.0256 69.0847C61.1954 69.2048 61.3779 69.3047 61.5697 69.3823L68.8242 72.3586C69.4871 72.6008 70.2158 72.5702 70.8572 72.2731C71.4985 71.976 72.0027 71.4355 72.2637 70.7652C72.5247 70.0949 72.5224 69.3469 72.2571 68.6784C71.9918 68.0098 71.4842 67.4728 70.841 67.1799L64 64.3711C66.0522 60.2888 67.1195 55.761 67.1122 51.1679V50.2378H75.2735C75.995 50.2378 76.687 49.9439 77.1972 49.4206C77.7073 48.8973 77.9939 48.1876 77.9939 47.4476C77.9939 46.7076 77.7073 45.9979 77.1972 45.4747C76.687 44.9514 75.995 44.6574 75.2735 44.6574H67.1122V39.7764C67.1122 36.3017 66.1219 33.0688 64.4171 30.353L70.841 27.7153C71.4842 27.4225 71.9918 26.8854 72.2571 26.2169C72.5224 25.5483 72.5247 24.8004 72.2637 24.1301C72.0027 23.4598 71.4985 22.9193 70.8572 22.6222C70.2158 22.3251 69.4871 22.2944 68.8242 22.5367L61.5697 25.5129C61.2356 25.6485 60.931 25.8509 60.6738 26.1082C59.8519 25.4397 58.9716 24.8507 58.044 24.3485V23.2659C58.0474 20.622 57.5259 18.0051 56.5113 15.5746C55.4967 13.1442 54.0102 10.951 52.1424 9.12886L58.5373 5.19654ZM16.3305 51.1679V39.7764C16.33 38.2188 16.6288 36.6763 17.2098 35.2372C17.7907 33.798 18.6425 32.4903 19.7164 31.3889C20.7902 30.2875 22.0652 29.4139 23.4684 28.818C24.8716 28.2222 26.3755 27.9157 27.8942 27.9162H50.1076C53.1744 27.9162 56.1157 29.1658 58.2843 31.39C60.4529 33.6142 61.6713 36.6309 61.6713 39.7764V51.1679C61.6715 56.852 59.6421 62.3393 55.9663 66.5932C52.2906 70.8471 47.2231 73.573 41.7213 74.2559V51.1679C41.7213 50.4279 41.4347 49.7182 40.9245 49.1949C40.4143 48.6717 39.7224 48.3777 39.0009 48.3777C38.2794 48.3777 37.5874 48.6717 37.0772 49.1949C36.5671 49.7182 36.2804 50.4279 36.2804 51.1679V74.2559C30.7786 73.573 25.7112 70.8471 22.0354 66.5932C18.3597 62.3393 16.3302 56.852 16.3305 51.1679ZM39.0009 9.31487C42.483 9.31455 45.8327 10.6839 48.3599 13.141C50.8871 15.598 52.3993 18.9555 52.585 22.5218C51.7658 22.3987 50.9391 22.3365 50.1112 22.3358H27.8869C27.059 22.3356 26.2322 22.3978 25.4132 22.5218C25.5989 18.9548 27.1116 15.5968 29.6396 13.1397C32.1675 10.6826 35.5181 9.3136 39.0009 9.31487Z"
          fill="#11103D"
          className={style.fill4}
        />
      </svg>
    </>
  );
};

export default BugIcon;
