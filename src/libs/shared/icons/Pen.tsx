const PenIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={46} height={48} viewBox="0 0 46 48" fill="none" {...props}>
      <g filter="url(#filter0_di_2121_5431)">
        <path fillRule="evenodd" clipRule="evenodd" d="M15.7109 28.3333C15.7109 27.9882 15.9908 27.7083 16.3359 27.7083H29.6693C30.0144 27.7083 30.2943 27.9882 30.2943 28.3333C30.2943 28.6785 30.0144 28.9583 29.6693 28.9583H16.3359C15.9908 28.9583 15.7109 28.6785 15.7109 28.3333Z" fill="#BAE7FF" />
        <path d="M22.6027 22.4411L27.5333 17.5105C26.8622 17.2312 26.0674 16.7724 25.3157 16.0207C24.5639 15.2689 24.1051 14.474 23.8259 13.8029L18.8952 18.7335C18.5104 19.1183 18.318 19.3107 18.1525 19.5229C17.9574 19.773 17.79 20.0438 17.6535 20.3303C17.5378 20.5731 17.4517 20.8313 17.2796 21.3475L16.3722 24.0697C16.2876 24.3238 16.3537 24.6039 16.543 24.7932C16.7324 24.9825 17.0125 25.0487 17.2665 24.964L19.9887 24.0566C20.5049 23.8845 20.7631 23.7985 21.0059 23.6827C21.2924 23.5462 21.5632 23.3789 21.8134 23.1837C22.0255 23.0182 22.2179 22.8259 22.6027 22.4411Z" fill="#BAE7FF" />
        <path d="M28.9005 16.142C29.9242 15.1182 29.9242 13.4583 28.9005 12.4345C27.8766 11.4107 26.2167 11.4107 25.193 12.4345L24.6016 13.0259C24.6096 13.0503 24.6181 13.0751 24.6268 13.1002C24.8436 13.725 25.2525 14.544 26.0219 15.3133C26.7912 16.0827 27.6102 16.4916 28.235 16.7084C28.26 16.7171 28.2846 16.7254 28.309 16.7335L28.9005 16.142Z" fill="#BAE7FF" />
      </g>
      <defs>
        <filter id="filter0_di_2121_5431" x={-2} y={-1} width={50} height={50} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy={4} />
          <feGaussianBlur stdDeviation="7.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.568627 0 0 0 0 0.835294 0 0 0 0 1 0 0 0 0.5 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2121_5431" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2121_5431" result="shape" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy={4} />
          <feGaussianBlur stdDeviation={2} />
          <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.75 0" />
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow_2121_5431" />
        </filter>
      </defs>
    </svg>

  );
};

export default PenIcon;
