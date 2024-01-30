import React from 'react';

import style from './icons.module.scss';

const IntegrationIcon = () => {
  return (
    <>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M31.1214 52.0443C26.635 54.3489 23.6782 54.0739 21.5912 51.2844C19.8617 48.9748 20.1216 45.4679 22.1861 43.2132C24.1481 41.0711 27.3598 41.1286 31.1339 43.5482C31.1339 42.1284 31.1363 40.8786 31.1339 39.6288C31.1189 33.9223 31.1039 28.2132 31.0864 22.5067C31.0814 21.0994 31.3788 19.7971 32.7584 19.1273C34.0881 18.4824 35.2278 19.0023 36.3026 19.8971C37.7447 21.0969 39.5992 20.9595 40.7889 19.6572C41.9886 18.3449 41.9686 16.3452 40.7414 15.0004C39.5592 13.7032 37.7822 13.6257 36.2576 14.8005C34.2456 16.3527 32.2386 16.0628 31.4063 14.0506C31.1913 13.5332 31.1488 12.9158 31.1438 12.3434C31.1164 9.55136 31.1014 6.76182 31.1388 3.96978C31.1513 3.08243 30.9289 2.72249 29.9541 2.72499C21.8712 2.75999 13.7907 2.73999 5.7077 2.75249C3.7357 2.75499 2.75094 3.77232 2.74844 5.79698C2.73845 13.8381 2.74844 21.8793 2.73845 29.9205C2.73845 30.6003 2.73595 31.1528 3.67821 31.1428C6.59498 31.1078 9.50926 31.1278 12.426 31.1178C12.581 31.1178 12.7359 31.0528 13.0834 30.9778C11.5812 29.0581 10.6615 26.976 11.5662 24.6988C12.0486 23.4815 12.9059 22.2567 13.9182 21.4419C16.1151 19.6747 19.1918 19.9546 21.2638 21.8218C23.7357 24.0464 23.8557 26.8535 21.4838 31.1378C22.7684 31.1378 23.8982 31.1503 25.0254 31.1328C25.9926 31.1178 26.8699 31.3127 26.8799 32.4725C26.8899 33.6273 26.0351 33.8548 25.0554 33.8348C23.8882 33.8123 22.7185 33.7673 21.5562 33.8423C20.3965 33.9148 19.6392 33.3949 19.1169 32.45C18.5495 31.4252 18.537 30.3754 19.1593 29.3631C19.3768 29.0106 19.6892 28.7182 19.9242 28.3757C20.9239 26.926 20.6915 24.9763 19.3968 23.8365C18.1671 22.7542 16.445 22.7617 15.1828 23.8565C13.8807 24.9863 13.6182 26.786 14.558 28.2657C14.7804 28.6157 15.0754 28.9181 15.3103 29.2606C15.9926 30.2479 15.9951 31.2802 15.4678 32.3351C14.9554 33.3624 14.1831 33.8673 12.9784 33.8448C10.0216 33.7923 7.06237 33.8798 4.1056 33.7998C2.96839 33.7698 2.71345 34.1523 2.71845 35.2246C2.75844 43.1808 2.73345 51.1394 2.73845 59.0981C2.73845 61.2402 3.7207 62.2376 5.87266 62.2451C11.9137 62.2676 17.9546 62.2626 23.9956 62.2701C24.453 62.2701 24.9129 62.2701 25.3703 62.2751C26.2626 62.2876 26.9974 62.57 26.9424 63.6099C26.8924 64.5697 26.1926 64.9671 25.3078 64.9696C18.602 64.9771 11.8937 65.0196 5.18783 64.9396C2.31105 64.9021 0.0116279 62.4276 0.00912852 59.5505C-0.00336836 41.511 -0.00336836 23.4715 0.00912852 5.42954C0.0116279 2.38005 2.34854 0.0154435 5.37779 0.012944C23.4183 -0.00205355 41.4563 -0.00205355 59.4943 0.00794479C62.4485 0.00794479 64.728 2.27257 64.7405 5.23707C64.7729 14.1531 64.768 23.0691 64.7654 31.9826C64.7654 33.4749 64.398 33.8073 62.9009 33.8073C59.7342 33.8123 56.57 33.8148 53.4033 33.8173C52.9634 33.8173 52.521 33.8173 51.7337 33.8173C53.4433 36.0494 54.2431 38.2716 53.1509 40.6387C52.6385 41.7535 51.7512 42.8408 50.7565 43.5582C48.5395 45.1579 45.4978 44.798 43.4958 42.9533C41.1064 40.7537 40.9564 38.0816 43.1159 33.9348C42.1061 33.8873 41.1938 33.8148 40.2791 33.8073C38.5295 33.7923 36.7799 33.8573 35.0329 33.8073C34.1156 33.7798 33.7832 34.0723 33.8007 35.0121C33.8507 37.8017 33.7857 40.5937 33.8382 43.3832C33.8632 44.638 33.3258 45.4479 32.2486 45.9578C31.1239 46.4902 30.0716 46.3502 29.0894 45.5829C28.697 45.2779 28.3121 44.943 27.8697 44.728C26.49 44.0581 24.5455 44.5105 23.7982 45.6253C22.9059 46.9551 22.9959 48.8398 24.0056 49.9271C25.1129 51.1194 27.0424 51.4269 28.3296 50.4495C29.5867 49.4947 30.7614 48.7198 32.406 49.5622C34.1481 50.4545 33.8107 52.0268 33.8207 53.4965C33.8382 55.9961 33.8682 58.4957 33.8282 60.9953C33.8132 61.9301 34.1531 62.2276 35.0704 62.2076C37.4448 62.1576 39.8217 62.1351 42.1936 62.2151C43.2858 62.2526 43.5857 61.8901 43.6657 60.8228C44.3056 52.3467 50.4265 45.4929 58.7045 43.9156C59.4793 43.7682 60.2766 43.6682 61.0614 43.6807C61.9711 43.6957 62.2011 43.2957 62.1561 42.4659C62.1036 41.4685 62.1461 40.4662 62.1561 39.4689C62.1661 38.5815 62.6235 38.0116 63.5008 37.9891C64.4155 37.9666 64.8279 38.594 64.8529 39.4564C64.8854 40.5812 64.9079 41.706 64.8704 42.8283C64.8454 43.5632 65.0579 43.8906 65.8402 44.1006C73.4758 46.1628 78.2421 51.0344 79.7067 58.8481C81.4138 67.9491 75.4978 76.9876 66.425 79.3922C56.59 81.9968 46.5125 76.0003 44.1031 66.0519C43.8732 65.1021 43.4858 64.8771 42.5935 64.8896C39.5118 64.9346 36.43 64.9146 33.3458 64.9021C31.5712 64.8946 31.1114 64.4322 31.1114 62.6875C31.1064 59.1956 31.1114 55.7037 31.1114 52.0393L31.1214 52.0443ZM33.9157 21.7743C33.8732 22.2317 33.8182 22.5517 33.8182 22.8691C33.8132 25.2013 33.8607 27.5359 33.8032 29.868C33.7807 30.8028 34.0781 31.1053 35.0104 31.0903C37.5497 31.0503 40.0891 31.1028 42.6285 31.1078C43.9731 31.1103 45.1379 31.5127 45.7402 32.785C46.3426 34.0573 45.9002 35.1871 45.0529 36.2444C43.7982 37.8092 43.9232 39.6738 45.2978 40.9511C46.505 42.0734 48.4895 42.0834 49.7567 40.9736C51.1563 39.7488 51.3038 37.8691 50.0341 36.2794C49.1593 35.1846 48.6695 34.0398 49.3418 32.72C50.0091 31.4127 51.2313 31.0903 52.616 31.1053C55.3228 31.1328 58.0321 31.0803 60.739 31.1328C61.7862 31.1528 62.0911 30.7653 62.0761 29.7505C62.0236 26.2511 62.0536 22.7517 62.0536 19.2522C62.0536 14.753 62.0711 10.2537 62.0486 5.75699C62.0386 3.8673 61.1114 2.77248 59.4293 2.76749C51.2238 2.73749 43.0184 2.75999 34.8129 2.73999C34.0381 2.73999 33.8082 3.03994 33.8157 3.77732C33.8432 6.60935 33.8257 9.44387 33.8357 12.2759C33.8357 12.4609 33.9232 12.6483 33.9681 12.8208C35.0429 12.3134 36.0051 11.6185 37.0574 11.431C38.1546 11.2336 39.4243 11.2936 40.4615 11.671C41.4563 12.0334 42.4135 12.8133 43.1034 13.6457C44.9729 15.9053 44.8379 19.1373 42.9509 21.3519C40.8289 23.8465 38.2721 23.994 33.9132 21.7743H33.9157ZM77.2523 61.8601C77.2098 53.2541 70.2616 46.2927 61.7737 46.3527C53.1159 46.4152 46.2626 53.4141 46.3076 62.1551C46.3475 70.4837 53.4758 77.3126 62.0686 77.2551C70.384 77.2001 77.2923 70.1963 77.2523 61.8601Z"
          fill="#11103D"
          className={style.fill4}
        />
        <path
          d="M66.5025 68.0459C66.5025 67.0287 66.4075 66.3513 66.535 65.7165C66.625 65.2691 66.9199 64.7242 67.2898 64.4993C68.382 63.8345 69.5567 63.3046 70.9239 62.6073C69.8641 62.0774 69.0543 61.565 68.1746 61.2526C66.8424 60.7802 66.2151 59.9804 66.495 58.5458C66.5625 58.1959 66.55 57.831 66.59 57.2561C68.0221 57.9759 69.3093 58.6208 70.594 59.2706C71.8936 59.9279 73.1983 60.5728 74.4855 61.2576C75.3253 61.705 75.6077 63.3471 74.8579 63.7545C72.2011 65.1916 69.4892 66.5263 66.5075 68.0484L66.5025 68.0459Z"
          fill="#11103D"
          className={style.fill4}
        />
        <path
          d="M57.0325 68.0384C54.1582 66.5613 51.4964 65.2191 48.8645 63.8244C48.1922 63.467 48.1422 61.8024 48.812 61.4575C51.4614 60.0854 54.1507 58.7882 56.825 57.466C56.8525 57.4535 56.9025 57.486 57.105 57.546C57.105 58.2733 57.1899 59.0631 57.0675 59.8204C57.01 60.1804 56.6201 60.5878 56.2752 60.7827C55.1979 61.3926 54.0682 61.9099 52.6936 62.5948C53.7933 63.1621 54.6531 63.717 55.5903 64.0619C56.8525 64.5293 57.3174 65.3441 57.1175 66.6287C57.0625 66.9886 57.0725 67.3611 57.035 68.0384H57.0325Z"
          fill="#11103D"
          className={style.fill4}
        />
        <path
          d="M58.1721 67.814C58.1721 67.8144 58.1727 67.8145 58.1728 67.8141C58.8399 66.0652 59.4995 64.3338 60.1616 62.6023C60.8589 60.7778 61.6438 58.9832 62.2236 57.1237C62.636 55.804 63.3758 55.3317 64.678 55.5491C65.2631 55.6497 65.6924 56.1911 65.4922 56.75C65.4794 56.7856 65.4663 56.821 65.4528 56.8563C64.2631 59.958 63.0659 63.0597 61.8687 66.1589C61.0639 68.2433 60.6915 68.4184 58.1726 67.8136C58.1724 67.8136 58.1721 67.8138 58.1721 67.814Z"
          fill="#11103D"
          className={style.fill4}
        />
      </svg>
    </>
  );
};

export default IntegrationIcon;