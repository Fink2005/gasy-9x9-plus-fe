interface HandMoneyProps extends React.SVGProps<SVGSVGElement> {}

const HandMoney = (props: HandMoneyProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={60}
    height={60}
    viewBox="0 0 65 67"
    fill="none"
    {...props}
  >
    <g filter="url(#a)" fill="#BAE7FF">
      <path d="M23.347 40.518H23c-1.257 0-1.886 0-2.276-.39-.39-.391-.39-1.02-.39-2.277v-1.483c0-.69 0-1.036.177-1.345.178-.309.445-.465.981-.776 3.528-2.052 8.537-3.207 11.88-1.212q.339.2.6.49c.743.835.69 2.096-.168 2.845-.181.158-.374.278-.569.32q.24-.028.46-.063c1.214-.194 2.234-.844 3.168-1.55l2.41-1.82c.85-.641 2.11-.641 2.96 0 .765.578.999 1.529.515 2.304-.564.904-1.358 2.06-2.121 2.767-.764.707-1.902 1.34-2.83 1.787-1.029.497-2.165.783-3.321.97-2.344.38-4.787.322-7.107-.157a20 20 0 0 0-4.022-.41m.434-25.07c-.489.489-.672 1.164-.74 2.218A3 3 0 0 0 26 14.707c-1.054.069-1.73.252-2.219.74m14.438.001c-.49-.49-1.165-.672-2.219-.74a3 3 0 0 0 2.959 2.958c-.069-1.054-.251-1.73-.74-2.218m0 9.104c-.49.49-1.165.672-2.219.74a3 3 0 0 1 2.959-2.958c-.069 1.054-.251 1.73-.74 2.218m-14.438 0c.49.49 1.165.672 2.219.74a3 3 0 0 0-2.959-2.958c.068 1.054.251 1.73.74 2.218" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23 19.667a5 5 0 0 0 5-5h6a5 5 0 0 0 5 5v.666a5 5 0 0 0-5 5h-6a5 5 0 0 0-5-5zm8 1.666a1.333 1.333 0 1 0 0-2.666 1.333 1.333 0 0 0 0 2.666"
      />
    </g>
    <defs>
      <filter
        id="a"
        x={-5}
        y={-2.667}
        width={72}
        height={72}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy={5.333} />
        <feGaussianBlur stdDeviation={10} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0.568627 0 0 0 0 0.835294 0 0 0 0 1 0 0 0 0.5 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_38_113" />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_38_113"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy={5.333} />
        <feGaussianBlur stdDeviation={2.667} />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.75 0" />
        <feBlend in2="shape" result="effect2_innerShadow_38_113" />
      </filter>
    </defs>
  </svg>
);
export default HandMoney;
