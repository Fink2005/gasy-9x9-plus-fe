interface CopyIconProps extends React.SVGProps<SVGSVGElement> {}

const CopyIcon = (props: CopyIconProps) => (
  <svg
    width={35}
    height={35}
    viewBox="10 -2 35 35"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g filter="url(#a)" fill="#69C0FF">
      <path d="M23.16 9.333h-2.596c-1.176 0-2.108 0-2.837.099-.75.101-1.358.314-1.837.795s-.691 1.09-.792 1.844C15 12.803 15 13.74 15 14.92v3.892a2.41 2.41 0 0 0 1.485 2.229c-.045-.607-.045-1.457-.045-2.165v-3.34c0-.854 0-1.59.079-2.18.085-.632.275-1.238.765-1.729.489-.491 1.092-.683 1.721-.768.588-.079 1.32-.079 2.172-.079h2.046c.851 0 1.583 0 2.17.08a2.4 2.4 0 0 0-2.233-1.526" />
      <path d="M17.4 15.598c0-1.817 0-2.726.562-3.29s1.468-.565 3.278-.565h1.92c1.81 0 2.715 0 3.278.564.562.565.562 1.474.562 3.291v3.213c0 1.818 0 2.726-.562 3.29-.563.566-1.468.566-3.278.566h-1.92c-1.81 0-2.715 0-3.278-.565-.562-.565-.562-1.473-.562-3.29z" />
    </g>
    <defs>
      <filter
        id="a"
        x={-2}
        y={-3}
        width={46}
        height={46}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy={4} />
        <feGaussianBlur stdDeviation={7.5} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0.568627 0 0 0 0 0.835294 0 0 0 0 1 0 0 0 0.5 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_215_225" />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_215_225"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy={4} />
        <feGaussianBlur stdDeviation={2} />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.75 0" />
        <feBlend in2="shape" result="effect2_innerShadow_215_225" />
      </filter>
    </defs>
  </svg>
);
export default CopyIcon;
