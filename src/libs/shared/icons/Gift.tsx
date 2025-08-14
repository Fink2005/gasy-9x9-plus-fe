import type { SVGProps } from 'react';

const GiftIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={66}
      height={67}
      viewBox="0 0 66 67"
      fill="none"
      {
        ...props
      }
    >
      <g filter="url(#filter0_di_2492_5725)">
        <path d="M31.001 14.6667C25.3766 14.6721 22.4665 14.7728 20.6203 16.619C18.7741 18.4652 18.6734 21.3753 18.668 26.9997H25.2193C24.7514 26.4152 24.4017 25.7257 24.211 24.963C23.4934 22.0923 26.0936 19.4921 28.9643 20.2097C29.727 20.4004 30.4165 20.7501 31.001 21.218V14.6667Z" fill="#BAE7FF" />
        <path d="M18.668 28.9997C18.6734 34.6241 18.7741 37.5341 20.6203 39.3804C22.4665 41.2265 25.3766 41.3272 31.001 41.3327V30.8312C29.9614 32.9076 27.8144 34.3331 25.3343 34.3331C24.782 34.3331 24.3343 33.8853 24.3343 33.3331C24.3343 32.7808 24.782 32.3331 25.3343 32.3331C27.3834 32.3331 29.1003 30.9108 29.5517 28.9997H18.668Z" fill="#BAE7FF" />
        <path d="M33 41.3327C38.6244 41.3272 41.5344 41.2265 43.3807 39.3804C45.2268 37.5341 45.3275 34.6241 45.3329 28.9997H34.4492C34.9007 30.9108 36.6176 32.3331 38.6667 32.3331C39.2189 32.3331 39.6667 32.7808 39.6667 33.3331C39.6667 33.8853 39.2189 34.3331 38.6667 34.3331C36.1865 34.3331 34.0395 32.9076 33 30.8312V41.3327Z" fill="#BAE7FF" />
        <path d="M45.3329 26.9997C45.3275 21.3753 45.2268 18.4652 43.3807 16.619C41.5344 14.7728 38.6244 14.6721 33 14.6667V21.218C33.5845 20.7501 34.274 20.4004 35.0365 20.2097C37.9073 19.4921 40.5076 22.0923 39.7899 24.963C39.5992 25.7257 39.2496 26.4152 38.7816 26.9997H45.3329Z" fill="#BAE7FF" />
        <path d="M28.4768 22.15C29.9589 22.5205 30.9986 23.8521 30.9986 25.3797V26.9997H29.3786C27.851 26.9997 26.5194 25.96 26.1489 24.478C25.7974 23.072 27.0709 21.7985 28.4768 22.15Z" fill="#BAE7FF" />
        <path d="M33 25.3797V26.9997H34.6199C36.1475 26.9997 37.4791 25.96 37.8496 24.478C38.2011 23.072 36.9276 21.7985 35.5217 22.15C34.0396 22.5205 33 23.8521 33 25.3797Z" fill="#BAE7FF" />
      </g>
      <defs>
        <filter id="filter0_di_2492_5725" x={-4} y="-2.66667" width={72} height={72} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="5.33333" />
          <feGaussianBlur stdDeviation={10} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.568627 0 0 0 0 0.835294 0 0 0 0 1 0 0 0 0.5 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2492_5725" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2492_5725" result="shape" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="5.33333" />
          <feGaussianBlur stdDeviation="2.66667" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.75 0" />
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow_2492_5725" />
        </filter>
      </defs>
    </svg>

  );
};

export default GiftIcon;
