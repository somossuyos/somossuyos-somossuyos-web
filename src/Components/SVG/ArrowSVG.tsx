import * as React from 'react';

type Props = React.SVGProps<SVGSVGElement>;

const ArrowSVG = (props: Props) => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="m19 14-7 7m0 0-7-7m7 7V3" />
  </svg>
);
export default ArrowSVG;
