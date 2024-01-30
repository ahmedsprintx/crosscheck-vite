import React from 'react';

import style from './icons.module.scss';

const FunctionalIcon = () => {
  return (
    <>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M60.3281 27.4703C64.7318 32.7044 61.5679 40.0574 55.6924 40.8677C55.3173 40.9192 54.9537 41.4719 54.6931 41.8641C54.3066 42.4454 54.4068 42.9636 54.9909 43.4533C55.8671 44.1863 56.7547 44.9422 57.4734 45.8183C58.0575 46.5313 58.7504 47.4246 58.7819 48.2607C58.8306 49.5177 59.4834 50.1133 60.3138 50.7747C65.7139 55.0983 71.1055 59.4276 76.4856 63.7741C79.3948 66.1248 80.4943 69.2458 79.7555 72.8307C79.0368 76.3182 76.8121 78.7033 73.3274 79.6339C69.7598 80.5873 66.6273 79.6825 64.1048 76.9309C59.3345 71.7254 54.5728 66.5114 49.8284 61.2801C49.2872 60.6817 48.746 60.53 47.9214 60.4212C46.7303 60.2637 45.2986 59.797 44.5399 58.9494C42.6615 56.8592 41.0896 56.5815 38.275 57.6724C21.7251 64.089 3.47446 53.5693 0.45368 36.1461C-2.21205 20.7674 7.5117 6.51101 22.8275 3.33561C37.1411 0.369237 51.4891 9.02212 55.6294 23.078C55.8699 23.8969 55.6065 25.1453 56.9093 25.3544C57.2787 25.4145 57.88 25.2828 58.0747 25.0165C60.6745 21.4832 63.2 17.8955 65.7941 14.3564C66.3181 13.6406 65.9201 13.2655 65.545 12.753C62.2551 8.24616 64.4398 1.84956 69.7884 0.294792C72.9094 -0.612873 76.4942 0.635524 78.4356 3.30698C80.4255 6.04429 80.5057 9.58046 78.6388 12.418C76.7892 15.2297 73.3589 16.6814 70.1749 15.7938C69.1155 15.4989 68.6631 15.7938 68.1076 16.5812C65.5593 20.209 62.9594 23.7996 60.3281 27.4703ZM25.2241 34.1304C25.5677 34.6658 25.8397 35.0581 26.0802 35.4675C27.6779 38.1791 27.4603 41.6379 25.5419 44.2178C23.655 46.7518 20.3622 47.9944 17.4473 47.2672C12.909 46.1362 10.1975 41.7639 11.3714 37.4747C12.6284 32.8906 17.1238 30.5112 21.8053 31.8884C22.1976 32.0029 22.8933 31.7567 23.1768 31.436C24.0931 30.4052 24.8289 29.2141 25.7394 28.1776C26.4667 27.3472 26.5383 26.7459 25.9084 25.7266C24.1732 22.9148 24.2792 19.98 26.0888 17.2312C27.8354 14.5769 30.4324 13.3314 33.5734 13.7093C36.8691 14.1045 39.2685 15.937 40.242 19.1725C40.6801 20.6328 40.6143 22.2477 40.8032 24.0487C43.0538 25.2227 45.5792 26.5369 47.9128 27.7538C49.5735 26.7287 51.0939 25.7924 52.663 24.8247C50.9937 16.0887 41.5305 5.31988 26.9907 5.96412C13.9054 6.54537 3.4945 17.486 3.20817 30.8548C2.93043 43.9286 12.9176 55.0782 26.2434 56.2808C39.1884 57.4491 49.1612 48.4698 51.6065 40.4897C47.6666 38.4998 46.2435 35.9772 46.5155 31.6507C46.5413 31.2184 46.2206 30.5455 45.8598 30.3422C43.8269 29.1969 41.7453 28.1346 39.6465 27.1182C39.3315 26.9664 38.6901 27.0408 38.4439 27.2699C35.7467 29.7638 32.7288 30.3394 29.2527 28.8619C27.9213 30.6056 26.5956 32.3408 25.2269 34.1332L25.2241 34.1304ZM51.6122 58.4942C56.7489 64.1177 61.7339 69.6295 66.8106 75.0555C67.5092 75.8028 68.6144 76.3525 69.6281 76.5959C72.394 77.2573 74.9796 75.9288 76.1707 73.4577C77.3876 70.938 76.7491 68.1377 74.4584 66.2795C70.1664 62.7948 65.8485 59.3446 61.5421 55.8828C60.1448 54.7604 58.7418 53.6409 57.2844 52.4755C55.3602 54.517 53.5363 56.4526 51.6122 58.4942ZM14.4552 39.3731C14.4323 42.2335 16.2877 44.1863 19.0766 44.2349C21.7795 44.2836 23.8611 42.2535 23.927 39.5076C23.99 36.8505 21.8969 34.6715 19.2197 34.6085C16.5168 34.5455 14.4752 36.5842 14.4523 39.3731H14.4552ZM54.401 37.7868C56.9837 37.7839 59.1971 35.6221 59.2085 33.0938C59.22 30.3709 57.0954 28.1432 54.507 28.169C51.7496 28.1976 49.5535 30.222 49.5821 32.7102C49.6165 35.4274 51.8556 37.7925 54.3982 37.7868H54.401ZM67.1943 7.89112C67.2143 10.5626 69.3961 12.8475 71.9273 12.8475C74.593 12.8475 76.7204 10.6971 76.7147 8.00565C76.709 5.28838 74.5844 3.21535 71.8672 3.27262C69.2444 3.32702 67.1742 5.37428 67.1943 7.89112ZM37.4417 21.592C37.4217 18.9349 35.3487 16.8561 32.723 16.8618C30.0516 16.8675 27.9356 19.0093 27.9356 21.7094C27.9356 24.2949 30.1661 26.4252 32.8719 26.4195C35.4861 26.4166 37.4618 24.3264 37.4446 21.592H37.4417ZM53.1126 46.0331C50.2865 49.0338 47.5749 51.9172 44.7775 54.8893C45.2671 55.3445 45.9772 55.9601 46.6386 56.6273C47.4948 57.492 48.2421 57.4347 49.0553 56.5443C50.4955 54.9637 52.0102 53.4462 53.4447 51.8599C56.2937 48.7131 56.8377 49.3774 52.935 45.9959C52.9035 45.9672 52.8434 45.973 53.1154 46.0331H53.1126Z"
          fill="#11103D"
          className={style.fill4}
        />
      </svg>
    </>
  );
};

export default FunctionalIcon;