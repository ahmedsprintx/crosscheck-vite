import React from 'react';

import style from './icons.module.scss';

const RetestIcon = ({ backClass, backClass1 }) => {
  return (
    <>
      <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M13.8033 13.3033C12.4461 14.6605 10.5711 15.5 8.5 15.5C4.35787 15.5 1 12.1421 1 8C1 3.85787 4.35787 0.5 8.5 0.5C10.5711 0.5 12.4461 1.33947 13.8033 2.69671C14.4941 3.38754 16 5.08333 16 5.08333"
          stroke="#11103D"
          stroke-linecap="round"
          stroke-linejoin="round"
          className={`${style.fill2} ${backClass}`}
        />
        <path
          d="M16 1.33313V5.08313H12.25"
          stroke="#11103D"
          stroke-linecap="round"
          stroke-linejoin="round"
          className={`${style.fill2} ${backClass}`}
        />
        <mask
          id="path-3-outside-1_2319_1267"
          maskUnits="userSpaceOnUse"
          x="3.75"
          y="4.1875"
          width="8"
          height="8"
          fill="black"
        >
          <rect fill="white" x="3.75" y="4.1875" width="8" height="8" />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M9.67523 5.61385C9.70132 5.59854 9.72412 5.57821 9.7423 5.55403C9.76049 5.52985 9.7737 5.50231 9.78118 5.47299C9.78865 5.44368 9.79025 5.41317 9.78586 5.38324C9.78147 5.3533 9.7712 5.32454 9.75563 5.2986C9.74006 5.27266 9.7195 5.25007 9.69514 5.23212C9.67079 5.21418 9.64311 5.20124 9.61373 5.19405C9.58434 5.18687 9.55382 5.18558 9.52393 5.19026C9.49404 5.19494 9.46538 5.2055 9.43959 5.22132L8.72413 5.65079C8.50788 5.54711 8.27106 5.49349 8.03125 5.4939C7.79154 5.49353 7.55483 5.54716 7.33868 5.65079L6.62291 5.22132C6.57088 5.19079 6.50891 5.18202 6.45046 5.19693C6.39201 5.21184 6.3418 5.24921 6.31075 5.30093C6.27971 5.35265 6.27033 5.41453 6.28465 5.47313C6.29898 5.53172 6.33586 5.5823 6.38727 5.61385L6.92539 5.93679C6.76826 6.08626 6.64319 6.26615 6.55782 6.4655C6.47244 6.66485 6.42853 6.8795 6.42878 7.09637V7.18489C6.35033 7.22609 6.27616 7.27462 6.20749 7.32926C6.18593 7.30818 6.16041 7.29159 6.1324 7.28042L5.52193 7.03624C5.46589 7.01511 5.4038 7.01679 5.34899 7.04092C5.29417 7.06504 5.25099 7.10968 5.2287 7.16527C5.20642 7.22086 5.20681 7.28297 5.22978 7.33828C5.25276 7.39359 5.2965 7.43769 5.35161 7.46112L5.89249 7.67753C5.74903 7.90035 5.6657 8.1659 5.6657 8.45069V8.85115H4.97892C4.91821 8.85115 4.85998 8.87527 4.81705 8.9182C4.77412 8.96113 4.75 9.01936 4.75 9.08008C4.75 9.14079 4.77412 9.19902 4.81705 9.24195C4.85998 9.28488 4.91821 9.309 4.97892 9.309H5.6657V9.38561C5.6657 9.77631 5.76032 10.1444 5.92789 10.4692L5.35161 10.6993C5.3237 10.7105 5.29825 10.7271 5.27674 10.7481C5.25523 10.7691 5.23806 10.7942 5.22623 10.8218C5.2144 10.8495 5.20812 10.8792 5.20777 10.9093C5.20742 10.9393 5.213 10.9692 5.22418 10.9971C5.23536 11.025 5.25193 11.0504 5.27295 11.072C5.29397 11.0935 5.31901 11.1106 5.34666 11.1225C5.37431 11.1343 5.40402 11.1406 5.43409 11.1409C5.46417 11.1413 5.49401 11.1357 5.52193 11.1245L6.1324 10.8803C6.14843 10.8739 6.16369 10.8657 6.17788 10.8559C6.39919 11.1354 6.68091 11.3611 7.00189 11.5161C7.32287 11.6712 7.67478 11.7515 8.03125 11.7512C8.38774 11.7515 8.73967 11.6711 9.06066 11.516C9.38164 11.3609 9.66334 11.1351 9.88462 10.8556C9.89891 10.8655 9.91427 10.8737 9.93041 10.88L10.5409 11.1242C10.5967 11.1441 10.658 11.1416 10.7119 11.1172C10.7659 11.0928 10.8083 11.0485 10.8303 10.9935C10.8523 10.9385 10.8521 10.8771 10.8297 10.8223C10.8074 10.7674 10.7647 10.7234 10.7106 10.6993L10.1349 10.4689C10.3076 10.1339 10.3974 9.76245 10.3968 9.38561V9.30931H11.0836C11.1443 9.30931 11.2025 9.28519 11.2454 9.24225C11.2884 9.19932 11.3125 9.1411 11.3125 9.08038C11.3125 9.01967 11.2884 8.96144 11.2454 8.91851C11.2025 8.87558 11.1443 8.85146 11.0836 8.85146H10.3968V8.45099C10.3968 8.1659 10.3135 7.90066 10.17 7.67784L10.7106 7.46143C10.7647 7.4374 10.8074 7.39334 10.8297 7.33849C10.8521 7.28364 10.8523 7.22227 10.8303 7.16727C10.8083 7.11228 10.7659 7.06793 10.7119 7.04356C10.658 7.01918 10.5967 7.01667 10.5409 7.03654L9.93041 7.28073C9.90229 7.29186 9.87666 7.30846 9.85501 7.32957C9.78586 7.27473 9.71178 7.22639 9.63372 7.18519V7.09637C9.63401 6.87945 9.59012 6.66474 9.50475 6.46533C9.41937 6.26592 9.29428 6.08599 9.13711 5.93649L9.67523 5.61385ZM6.12355 9.38561V8.45099C6.12351 8.32319 6.14865 8.19664 6.19754 8.07856C6.24642 7.96048 6.3181 7.8532 6.40847 7.76283C6.49883 7.67246 6.60612 7.60079 6.7242 7.5519C6.84228 7.50301 6.96883 7.47787 7.09663 7.47791H8.96587C9.22395 7.47791 9.47146 7.58043 9.65394 7.76292C9.83643 7.94541 9.93895 8.19291 9.93895 8.45099V9.38561C9.93897 9.85197 9.7682 10.3022 9.45889 10.6512C9.14957 11.0002 8.72315 11.2239 8.26017 11.2799V9.38561C8.26017 9.3249 8.23606 9.26667 8.19312 9.22374C8.15019 9.18081 8.09196 9.15669 8.03125 9.15669C7.97054 9.15669 7.91231 9.18081 7.86938 9.22374C7.82644 9.26667 7.80233 9.3249 7.80233 9.38561V11.2799C7.33935 11.2239 6.91293 11.0002 6.60361 10.6512C6.2943 10.3022 6.12353 9.85197 6.12355 9.38561ZM8.03125 5.95175C8.32427 5.95172 8.60615 6.06407 8.81881 6.26566C9.03147 6.46725 9.15872 6.74272 9.17435 7.03532C9.10542 7.02522 9.03584 7.02012 8.96618 7.02006H7.09602C7.02635 7.02004 6.95677 7.02514 6.88785 7.03532C6.90348 6.74266 7.03077 6.46715 7.2435 6.26556C7.45622 6.06396 7.73817 5.95164 8.03125 5.95175Z"
          />
        </mask>
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M9.67523 5.61385C9.70132 5.59854 9.72412 5.57821 9.7423 5.55403C9.76049 5.52985 9.7737 5.50231 9.78118 5.47299C9.78865 5.44368 9.79025 5.41317 9.78586 5.38324C9.78147 5.3533 9.7712 5.32454 9.75563 5.2986C9.74006 5.27266 9.7195 5.25007 9.69514 5.23212C9.67079 5.21418 9.64311 5.20124 9.61373 5.19405C9.58434 5.18687 9.55382 5.18558 9.52393 5.19026C9.49404 5.19494 9.46538 5.2055 9.43959 5.22132L8.72413 5.65079C8.50788 5.54711 8.27106 5.49349 8.03125 5.4939C7.79154 5.49353 7.55483 5.54716 7.33868 5.65079L6.62291 5.22132C6.57088 5.19079 6.50891 5.18202 6.45046 5.19693C6.39201 5.21184 6.3418 5.24921 6.31075 5.30093C6.27971 5.35265 6.27033 5.41453 6.28465 5.47313C6.29898 5.53172 6.33586 5.5823 6.38727 5.61385L6.92539 5.93679C6.76826 6.08626 6.64319 6.26615 6.55782 6.4655C6.47244 6.66485 6.42853 6.8795 6.42878 7.09637V7.18489C6.35033 7.22609 6.27616 7.27462 6.20749 7.32926C6.18593 7.30818 6.16041 7.29159 6.1324 7.28042L5.52193 7.03624C5.46589 7.01511 5.4038 7.01679 5.34899 7.04092C5.29417 7.06504 5.25099 7.10968 5.2287 7.16527C5.20642 7.22086 5.20681 7.28297 5.22978 7.33828C5.25276 7.39359 5.2965 7.43769 5.35161 7.46112L5.89249 7.67753C5.74903 7.90035 5.6657 8.1659 5.6657 8.45069V8.85115H4.97892C4.91821 8.85115 4.85998 8.87527 4.81705 8.9182C4.77412 8.96113 4.75 9.01936 4.75 9.08008C4.75 9.14079 4.77412 9.19902 4.81705 9.24195C4.85998 9.28488 4.91821 9.309 4.97892 9.309H5.6657V9.38561C5.6657 9.77631 5.76032 10.1444 5.92789 10.4692L5.35161 10.6993C5.3237 10.7105 5.29825 10.7271 5.27674 10.7481C5.25523 10.7691 5.23806 10.7942 5.22623 10.8218C5.2144 10.8495 5.20812 10.8792 5.20777 10.9093C5.20742 10.9393 5.213 10.9692 5.22418 10.9971C5.23536 11.025 5.25193 11.0504 5.27295 11.072C5.29397 11.0935 5.31901 11.1106 5.34666 11.1225C5.37431 11.1343 5.40402 11.1406 5.43409 11.1409C5.46417 11.1413 5.49401 11.1357 5.52193 11.1245L6.1324 10.8803C6.14843 10.8739 6.16369 10.8657 6.17788 10.8559C6.39919 11.1354 6.68091 11.3611 7.00189 11.5161C7.32287 11.6712 7.67478 11.7515 8.03125 11.7512C8.38774 11.7515 8.73967 11.6711 9.06066 11.516C9.38164 11.3609 9.66334 11.1351 9.88462 10.8556C9.89891 10.8655 9.91427 10.8737 9.93041 10.88L10.5409 11.1242C10.5967 11.1441 10.658 11.1416 10.7119 11.1172C10.7659 11.0928 10.8083 11.0485 10.8303 10.9935C10.8523 10.9385 10.8521 10.8771 10.8297 10.8223C10.8074 10.7674 10.7647 10.7234 10.7106 10.6993L10.1349 10.4689C10.3076 10.1339 10.3974 9.76245 10.3968 9.38561V9.30931H11.0836C11.1443 9.30931 11.2025 9.28519 11.2454 9.24225C11.2884 9.19932 11.3125 9.1411 11.3125 9.08038C11.3125 9.01967 11.2884 8.96144 11.2454 8.91851C11.2025 8.87558 11.1443 8.85146 11.0836 8.85146H10.3968V8.45099C10.3968 8.1659 10.3135 7.90066 10.17 7.67784L10.7106 7.46143C10.7647 7.4374 10.8074 7.39334 10.8297 7.33849C10.8521 7.28364 10.8523 7.22227 10.8303 7.16727C10.8083 7.11228 10.7659 7.06793 10.7119 7.04356C10.658 7.01918 10.5967 7.01667 10.5409 7.03654L9.93041 7.28073C9.90229 7.29186 9.87666 7.30846 9.85501 7.32957C9.78586 7.27473 9.71178 7.22639 9.63372 7.18519V7.09637C9.63401 6.87945 9.59012 6.66474 9.50475 6.46533C9.41937 6.26592 9.29428 6.08599 9.13711 5.93649L9.67523 5.61385ZM6.12355 9.38561V8.45099C6.12351 8.32319 6.14865 8.19664 6.19754 8.07856C6.24642 7.96048 6.3181 7.8532 6.40847 7.76283C6.49883 7.67246 6.60612 7.60079 6.7242 7.5519C6.84228 7.50301 6.96883 7.47787 7.09663 7.47791H8.96587C9.22395 7.47791 9.47146 7.58043 9.65394 7.76292C9.83643 7.94541 9.93895 8.19291 9.93895 8.45099V9.38561C9.93897 9.85197 9.7682 10.3022 9.45889 10.6512C9.14957 11.0002 8.72315 11.2239 8.26017 11.2799V9.38561C8.26017 9.3249 8.23606 9.26667 8.19312 9.22374C8.15019 9.18081 8.09196 9.15669 8.03125 9.15669C7.97054 9.15669 7.91231 9.18081 7.86938 9.22374C7.82644 9.26667 7.80233 9.3249 7.80233 9.38561V11.2799C7.33935 11.2239 6.91293 11.0002 6.60361 10.6512C6.2943 10.3022 6.12353 9.85197 6.12355 9.38561ZM8.03125 5.95175C8.32427 5.95172 8.60615 6.06407 8.81881 6.26566C9.03147 6.46725 9.15872 6.74272 9.17435 7.03532C9.10542 7.02522 9.03584 7.02012 8.96618 7.02006H7.09602C7.02635 7.02004 6.95677 7.02514 6.88785 7.03532C6.90348 6.74266 7.03077 6.46715 7.2435 6.26556C7.45622 6.06396 7.73817 5.95164 8.03125 5.95175Z"
          fill="#11103D"
          className={`${style.fill4} ${backClass1}`}
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M9.67523 5.61385C9.70132 5.59854 9.72412 5.57821 9.7423 5.55403C9.76049 5.52985 9.7737 5.50231 9.78118 5.47299C9.78865 5.44368 9.79025 5.41317 9.78586 5.38324C9.78147 5.3533 9.7712 5.32454 9.75563 5.2986C9.74006 5.27266 9.7195 5.25007 9.69514 5.23212C9.67079 5.21418 9.64311 5.20124 9.61373 5.19405C9.58434 5.18687 9.55382 5.18558 9.52393 5.19026C9.49404 5.19494 9.46538 5.2055 9.43959 5.22132L8.72413 5.65079C8.50788 5.54711 8.27106 5.49349 8.03125 5.4939C7.79154 5.49353 7.55483 5.54716 7.33868 5.65079L6.62291 5.22132C6.57088 5.19079 6.50891 5.18202 6.45046 5.19693C6.39201 5.21184 6.3418 5.24921 6.31075 5.30093C6.27971 5.35265 6.27033 5.41453 6.28465 5.47313C6.29898 5.53172 6.33586 5.5823 6.38727 5.61385L6.92539 5.93679C6.76826 6.08626 6.64319 6.26615 6.55782 6.4655C6.47244 6.66485 6.42853 6.8795 6.42878 7.09637V7.18489C6.35033 7.22609 6.27616 7.27462 6.20749 7.32926C6.18593 7.30818 6.16041 7.29159 6.1324 7.28042L5.52193 7.03624C5.46589 7.01511 5.4038 7.01679 5.34899 7.04092C5.29417 7.06504 5.25099 7.10968 5.2287 7.16527C5.20642 7.22086 5.20681 7.28297 5.22978 7.33828C5.25276 7.39359 5.2965 7.43769 5.35161 7.46112L5.89249 7.67753C5.74903 7.90035 5.6657 8.1659 5.6657 8.45069V8.85115H4.97892C4.91821 8.85115 4.85998 8.87527 4.81705 8.9182C4.77412 8.96113 4.75 9.01936 4.75 9.08008C4.75 9.14079 4.77412 9.19902 4.81705 9.24195C4.85998 9.28488 4.91821 9.309 4.97892 9.309H5.6657V9.38561C5.6657 9.77631 5.76032 10.1444 5.92789 10.4692L5.35161 10.6993C5.3237 10.7105 5.29825 10.7271 5.27674 10.7481C5.25523 10.7691 5.23806 10.7942 5.22623 10.8218C5.2144 10.8495 5.20812 10.8792 5.20777 10.9093C5.20742 10.9393 5.213 10.9692 5.22418 10.9971C5.23536 11.025 5.25193 11.0504 5.27295 11.072C5.29397 11.0935 5.31901 11.1106 5.34666 11.1225C5.37431 11.1343 5.40402 11.1406 5.43409 11.1409C5.46417 11.1413 5.49401 11.1357 5.52193 11.1245L6.1324 10.8803C6.14843 10.8739 6.16369 10.8657 6.17788 10.8559C6.39919 11.1354 6.68091 11.3611 7.00189 11.5161C7.32287 11.6712 7.67478 11.7515 8.03125 11.7512C8.38774 11.7515 8.73967 11.6711 9.06066 11.516C9.38164 11.3609 9.66334 11.1351 9.88462 10.8556C9.89891 10.8655 9.91427 10.8737 9.93041 10.88L10.5409 11.1242C10.5967 11.1441 10.658 11.1416 10.7119 11.1172C10.7659 11.0928 10.8083 11.0485 10.8303 10.9935C10.8523 10.9385 10.8521 10.8771 10.8297 10.8223C10.8074 10.7674 10.7647 10.7234 10.7106 10.6993L10.1349 10.4689C10.3076 10.1339 10.3974 9.76245 10.3968 9.38561V9.30931H11.0836C11.1443 9.30931 11.2025 9.28519 11.2454 9.24225C11.2884 9.19932 11.3125 9.1411 11.3125 9.08038C11.3125 9.01967 11.2884 8.96144 11.2454 8.91851C11.2025 8.87558 11.1443 8.85146 11.0836 8.85146H10.3968V8.45099C10.3968 8.1659 10.3135 7.90066 10.17 7.67784L10.7106 7.46143C10.7647 7.4374 10.8074 7.39334 10.8297 7.33849C10.8521 7.28364 10.8523 7.22227 10.8303 7.16727C10.8083 7.11228 10.7659 7.06793 10.7119 7.04356C10.658 7.01918 10.5967 7.01667 10.5409 7.03654L9.93041 7.28073C9.90229 7.29186 9.87666 7.30846 9.85501 7.32957C9.78586 7.27473 9.71178 7.22639 9.63372 7.18519V7.09637C9.63401 6.87945 9.59012 6.66474 9.50475 6.46533C9.41937 6.26592 9.29428 6.08599 9.13711 5.93649L9.67523 5.61385ZM6.12355 9.38561V8.45099C6.12351 8.32319 6.14865 8.19664 6.19754 8.07856C6.24642 7.96048 6.3181 7.8532 6.40847 7.76283C6.49883 7.67246 6.60612 7.60079 6.7242 7.5519C6.84228 7.50301 6.96883 7.47787 7.09663 7.47791H8.96587C9.22395 7.47791 9.47146 7.58043 9.65394 7.76292C9.83643 7.94541 9.93895 8.19291 9.93895 8.45099V9.38561C9.93897 9.85197 9.7682 10.3022 9.45889 10.6512C9.14957 11.0002 8.72315 11.2239 8.26017 11.2799V9.38561C8.26017 9.3249 8.23606 9.26667 8.19312 9.22374C8.15019 9.18081 8.09196 9.15669 8.03125 9.15669C7.97054 9.15669 7.91231 9.18081 7.86938 9.22374C7.82644 9.26667 7.80233 9.3249 7.80233 9.38561V11.2799C7.33935 11.2239 6.91293 11.0002 6.60361 10.6512C6.2943 10.3022 6.12353 9.85197 6.12355 9.38561ZM8.03125 5.95175C8.32427 5.95172 8.60615 6.06407 8.81881 6.26566C9.03147 6.46725 9.15872 6.74272 9.17435 7.03532C9.10542 7.02522 9.03584 7.02012 8.96618 7.02006H7.09602C7.02635 7.02004 6.95677 7.02514 6.88785 7.03532C6.90348 6.74266 7.03077 6.46715 7.2435 6.26556C7.45622 6.06396 7.73817 5.95164 8.03125 5.95175Z"
          stroke="#11103D"
          stroke-width="0.4"
          mask="url(#path-3-outside-1_2319_1267)"
          className={`${style.fill2} ${backClass}`}
        />
      </svg>
    </>
  );
};

export default RetestIcon;