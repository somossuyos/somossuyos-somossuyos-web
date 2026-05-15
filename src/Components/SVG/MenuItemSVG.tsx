import React from 'react';

type Props = React.SVGProps<SVGSVGElement>;

const MenuItemSVG = (props: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={10.291}
      {...props}
    >
      <path
        fill="currentColor"
        d="m9.003 3.102 6.805 6.811a1.287 1.287 0 1 0 1.817-1.822L9.914.374A1.284 1.284 0 0 0 8.14.336L.375 8.084a1.288 1.288 0 1 0 1.819 1.823Z"
        data-name="Icon ionic-ios-arrow-back"
      />
    </svg>
  );
};

export default MenuItemSVG;